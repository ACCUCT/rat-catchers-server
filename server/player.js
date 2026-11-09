'use strict';
// Player state, inventory, money, levels, quests, achievements, the Rat Index and rewards.
// Everything here runs on the server; the client only ever asks.
const crypto = require('node:crypto');
const D = require('../shared/data.js');
const { SP, RI, RARITIES, MUTATIONS, ROD, POT, ACH, ACHIEVEMENTS, COS, FIELDS, SPECIES, QUESTS } = D;

const dayNow = () => Math.floor(Date.now() / 86400000);
const newId = () => crypto.randomBytes(9).toString('base64url');

function newData() {
  return { rods: ['wood'], rod: 'wood', potions: {}, eff: {}, eggs: {}, boxes: 0, snacks: 0, slots: 0, storage: 0, inv: 0, equip: 0, cos: {}, ach: {}, titles: [], title: '',
    daily: { streak: 0, last: -1 }, quests: { day: -1, list: [] }, index: {}, idxMs: [], stats: {}, showcase: { rats: [], theme: 'classic' }, tokens: 0, fieldsVisited: {}, joined: Date.now() };
}
function ratFromRow(r) { let cos = {}; try { cos = JSON.parse(r.cos || '{}'); } catch (e) {} return { id: r.id, sp: r.sp, mut: r.mut || null, wx: r.wx || null, disco: r.disco ? 1 : 0, lvl: r.lvl, xp: r.xp, cap: r.cap, evo: r.evo, fav: r.fav ? 1 : 0, lock: r.lock ? 1 : 0, place: r.place, slot: r.slot, cos, born: r.born, src: r.src }; }
function ratView(r) { return { id: r.id, sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco, lvl: r.lvl, xp: Math.floor(r.xp), cap: r.cap, evo: r.evo, fav: r.fav, lock: r.lock, place: r.place, slot: r.slot, cos: r.cos, born: r.born }; }
function lookView(r) { return { sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco, evo: r.evo, lvl: r.lvl, cos: r.cos }; }

function load(G, acc) {
  const row = G.db.st.plGet.get(acc.id); if (!row) return null;
  let d = {}; try { d = JSON.parse(row.data || '{}'); } catch (e) {}
  d = Object.assign(newData(), d);
  // eggs were removed from the game: eggs a player still had become money (what they cost)
  if (d.eggs && Object.keys(d.eggs).some(k => d.eggs[k] > 0)) { let back = 0; for (const k of Object.keys(d.eggs)) back += Math.max(0, d.eggs[k] | 0) * ((G.cfg.eggs[k] || D.EGG[k] || { price: 0 }).price || 0); d.eggs = {}; d.eggRefund = (d.eggRefund || 0) + back; }
  const refund = d.eggRefund || 0; delete d.eggRefund;
  if (d.quests && Array.isArray(d.quests.list)) d.quests.list = d.quests.list.filter(q => q.stat !== 'eggs');
  const P = { id: acc.id, name: acc.name, money: row.money, level: row.level, xp: row.xp, rebirths: row.rebirths, caught: row.caught, trades: row.trades, d, last_seen: row.last_seen, color: row.color || '#ff9f1a', rats: new Map(), dirty: false };
  for (const r of G.db.st.ratsOf.all(acc.id)) P.rats.set(r.id, ratFromRow(r));
  if (refund > 0) { P.money += refund; P.eggRefund = refund; P.dirty = true; }
  return P;
}
function scores(P) {
  let rs = 0, ms = 0;
  for (const r of P.rats.values()) { const s = SP[r.sp]; if (!s) continue; rs += RI[s.r].pts * (1 + (r.evo || 0)); for (const m of [r.mut, r.wx, r.disco ? 'disco' : null]) if (m) ms += MUTATIONS[m].pts; }
  return [rs, ms];
}
function save(G, P) {
  const [rs, ms] = scores(P);
  G.db.st.plSave.run(P.money, P.level, P.xp, P.rebirths, P.caught, P.trades, rs, ms, JSON.stringify(P.d), P.online ? Date.now() : P.last_seen, P.color, P.id);
  P.dirty = false;
}
function saveRat(G, P, r) { G.db.st.ratSave.run(r.mut, r.wx, r.disco, r.lvl, r.xp, r.cap, r.evo, r.fav, r.lock, r.place, r.slot, JSON.stringify(r.cos || {}), r.id, P.id); }

// ---------- capacity ----------
const cap = (G, P) => ({ slots: G.cfg.startSlots + P.d.slots, storage: G.cfg.startStorage + P.d.storage * G.cfg.storageStep, inv: G.cfg.startInventory + P.d.inv * G.cfg.inventoryStep, equip: G.cfg.startEquip + P.d.equip });
function countPlace(P, place) { let n = 0; for (const r of P.rats.values()) if (r.place === place) n++; return n; }
// where a new rat goes: the backpack, then storage, else nowhere
function roomFor(G, P) { const c = cap(G, P); if (countPlace(P, 'inv') < c.inv) return 'inv'; if (countPlace(P, 'sto') < c.storage) return 'sto'; return null; }

// ---------- money, luck and earnings ----------
function eff(P, cat) { const e = P.d.eff[cat]; return e && e.ends > Date.now() ? e : null; }
function petLuck(r) { const s = SP[r.sp]; return s ? 0.02 * (RI[s.r].i + 1) * (1 + 0.5 * (r.evo || 0)) : 0; }
function luckOf(G, P) {
  const rod = ROD[P.d.rod] || ROD.wood, rc = G.cfg.rods[rod.id] || rod;
  let l = rc.luck * (1 + G.cfg.rebirthLuck * P.rebirths) * (G.cfg.globalLuck || 1);
  const e = eff(P, 'luck'); if (e) l *= e.mult;
  let pet = 0; for (const r of P.rats.values()) if (r.place === 'eq') pet += petLuck(r);
  return l * (1 + pet);
}
function earnMods(P, withPotion) { const e = withPotion ? eff(P, 'money') : null; return { money: e ? e.mult : 1, rebirths: P.rebirths }; }
function mps(G, P, withPotion) {
  const mods = earnMods(P, withPotion !== false); let t = 0; const per = {};
  for (const r of P.rats.values()) if (r.place === 'slot') { const v = D.ratEarn(G.cfg, r, mods).total; per[r.id] = v; t += v; }
  return { total: t, per };
}
function stat(P, k) { return P.d.stats[k] || 0; }
function bump(G, P, k, n) { P.d.stats[k] = (P.d.stats[k] || 0) + (n == null ? 1 : n); questProgress(G, P, k, n == null ? 1 : n); P.dirty = true; }
function addMoney(G, P, v, earned) {
  P.money += v; if (P.money < 0) P.money = 0;
  if (P.money > (P.d.stats.peakMoney || 0)) { P.d.stats.peakMoney = P.money; }
  if (earned && v > 0) { P.d.stats.earned = (P.d.stats.earned || 0) + v; questProgress(G, P, 'earned', v); }
  P.dirty = true;
}
function addXP(G, P, xp) {
  P.xp += xp; let up = 0;
  while (P.xp >= D.playerXpNeed(P.level)) { P.xp -= D.playerXpNeed(P.level); P.level++; up++; }
  if (up) { G.toast(P, { kind: 'level', text: 'Level up! You are now level ' + P.level + '.' }); checkAch(G, P); }
  P.dirty = true; return up;
}

// ---------- Rat Index ----------
function discover(G, P, r) {
  const e = P.d.index[r.sp] || (P.d.index[r.sp] = { n: 0, m: {} }); const isNew = !e.n; e.n++;
  for (const m of [r.mut, r.wx, r.disco ? 'disco' : null]) if (m) e.m[m] = 1;
  if (r.evo) e.m['evo' + r.evo] = 1;
  const s = SP[r.sp]; if (s) { P.d.stats['r_' + s.r] = (P.d.stats['r_' + s.r] || 0) + 1; }
  if (isNew) {
    G.toast(P, { kind: 'index', text: 'New in your Rat Index: ' + (s ? s.n : r.sp) + '!' });
    const pct = Math.floor(indexCount(P) / SPECIES.length * 100);
    for (const ms of [10, 25, 50, 75, 100]) if (pct >= ms && !P.d.idxMs.includes(ms)) { P.d.idxMs.push(ms); const rw = INDEX_RW[ms]; grant(G, P, rw, 'Rat Index ' + ms + '% complete'); }
  }
  checkAch(G, P);
}
const INDEX_RW = { 10: { money: 5000, potion: 'luck' }, 25: { money: 50000, potion: 'luck', mystery: 1 }, 50: { money: 2500000, potion: 'superluck' }, 75: { money: 100000000, potion: 'superluck' }, 100: { money: 1000000000, potion: 'ultraluck' } };
const indexCount = P => Object.keys(P.d.index).filter(k => SP[k] && P.d.index[k].n > 0).length;
function fieldsDone(P) { let n = 0; for (const f of FIELDS) { const nat = SPECIES.filter(s => s.fields.includes(f.id)); if (nat.length && nat.every(s => P.d.index[s.id] && P.d.index[s.id].n)) n++; } return n; }

// ---------- achievements ----------
function achValue(P, a) {
  switch (a.stat) { case 'caught': return P.caught; case 'trades': return P.trades; case 'level': return P.level; case 'rebirths': return P.rebirths;
    case 'indexN': return indexCount(P); case 'fieldsDone': return fieldsDone(P); default: return stat(P, a.stat); }
}
function checkAch(G, P) {
  for (const a of ACHIEVEMENTS) {
    if (P.d.ach[a.id]) continue;
    if (achValue(P, a) >= a.goal) { P.d.ach[a.id] = Date.now(); grant(G, P, a.rw, 'Achievement: ' + a.n); G.toast(P, { kind: 'ach', text: 'Achievement unlocked: ' + a.n, sub: a.d }); }
  }
}
function achList(P) { return ACHIEVEMENTS.map(a => ({ id: a.id, v: Math.min(achValue(P, a), a.goal), done: P.d.ach[a.id] || 0 })); }

// ---------- rewards ----------
function grant(G, P, rw, why) {
  if (!rw) return [];
  const got = [];
  if (rw.money) { const m = rw.special || rw.money < 20 ? rewardMoney(G, P, rw.money) : rw.money; addMoney(G, P, m, false); got.push(D.fmtMoney(m)); }
  if (rw.potion) { P.d.potions[rw.potion] = (P.d.potions[rw.potion] || 0) + 1; got.push(POT[rw.potion].n); }
  if (rw.egg) { const n = rw.n || 1, id = rw.egg === 'egg2' ? 'luck' : 'superluck'; P.d.potions[id] = (P.d.potions[id] || 0) + n; got.push((n > 1 ? n + 'x ' : '') + POT[id].n); } // eggs were removed: a luck potion instead
  if (rw.cos) { P.d.cos[rw.cos] = (P.d.cos[rw.cos] || 0) + 1; got.push(COS[rw.cos].n); }
  if (rw.title && !P.d.titles.includes(rw.title)) { P.d.titles.push(rw.title); if (!P.d.title) P.d.title = rw.title; got.push('title “' + rw.title + '”'); }
  if (rw.mystery) { P.d.boxes += rw.mystery; got.push('Mystery Box'); }
  if (rw.tokens) { P.d.tokens += rw.tokens; got.push(rw.tokens + ' event tokens'); }
  if (rw.rod === 'next') { // the next rod after the best one the player owns
    const best = Math.max(...P.d.rods.map(r => ROD[r].i)), up = D.RODS[best + 1];
    if (up && !P.d.rods.includes(up.id)) { P.d.rods.push(up.id); got.push(up.n); } else { const m = rewardMoney(G, P, 3); addMoney(G, P, m, false); got.push(D.fmtMoney(m) + ' (you have every rod!)'); }
  } else if (rw.rod) { if (!P.d.rods.includes(rw.rod)) P.d.rods.push(rw.rod); got.push(ROD[rw.rod].n); }
  P.dirty = true;
  if (why && got.length) G.toast(P, { kind: 'reward', text: why, sub: got.join(' · ') });
  return got;
}
// small money rewards scale with how far the player has come
function rewardMoney(G, P, k) { const m = mps(G, P, false).total; return Math.round(Math.max(1000 * k, Math.min(m * 300 * k, 1e15)) * (1 + P.level / 20)); }

// ---------- daily rewards ----------
function dailyState(P) { const today = dayNow(), d = P.d.daily; const can = d.last !== today; const streak = can ? (d.last === today - 1 ? d.streak + 1 : 1) : d.streak; return { can, streak, day: ((streak - 1) % 7 + 7) % 7, last: d.last }; }
function claimDaily(G, P) {
  const s = dailyState(P); if (!s.can) return { ok: false, why: 'Come back tomorrow for your next reward.' };
  P.d.daily = { streak: s.streak, last: dayNow() };
  const rw = Object.assign({}, D.DAILY[s.day]);
  if (rw.cos === 'chefhat') rw.cos = D.DAILY_COS_ROTATION[Math.floor((s.streak - 1) / 7) % D.DAILY_COS_ROTATION.length];
  const got = grant(G, P, rw, s.day === 6 ? 'Day 7 special reward!' : 'Daily reward, day ' + (s.day + 1));
  P.dirty = true; return { ok: true, day: s.day, streak: s.streak, got };
}

// ---------- daily quests ----------
function ensureQuests(G, P) {
  const today = dayNow(); if (P.d.quests.day === today) return;
  const r = D.mulberry(P.id * 7919 + today * 104729), tier = P.level < 15 ? 0 : P.level < 50 ? 1 : 2;
  const pool = QUESTS.slice(), list = [], count = 3 + ((r() * 3) | 0);
  const m = Math.max(1, mps(G, P, false).total);
  while (list.length < count && pool.length) {
    const q = pool.splice((r() * pool.length) | 0, 1)[0];
    let n = q.n[tier]; if (q.money) n = Math.round(Math.max(5000, m * 300) * q.n[tier]);
    const rwRoll = r(), reward = { money: Math.round(Math.max(800, m * 90) * (1 + tier) * (1 + list.length * 0.25)) };
    if (rwRoll < 0.35) reward.potion = ['luck', 'money', 'catch', 'speed'][(r() * 4) | 0]; else if (rwRoll < 0.55) reward.potion = tier ? 'superluck' : 'luck';
    list.push({ id: q.id, stat: q.stat, n, prog: 0, claimed: 0, rw: reward, d: q.d.replace('{n}', D.fmtN(n)).replace('{money}', D.fmtMoney(n)) });
  }
  P.d.quests = { day: today, list }; P.d.fieldsVisited = {}; P.dirty = true;
}
function questProgress(G, P, k, n) {
  if (!P.d.quests || P.d.quests.day !== dayNow()) return;
  let ch = false, done = false;
  for (const q of P.d.quests.list) if (q.stat === k && q.prog < q.n) { q.prog = Math.min(q.n, q.prog + n); ch = true; if (q.prog >= q.n) { done = true; G.toast(P, { kind: 'quest', text: 'Quest complete: ' + q.d, sub: 'Claim your reward in Quests.' }); } }
  // money quests move every second; tell the player about them now and then, not every tick
  if (ch) { P.dirty = true; const t = Date.now(); if (done || k !== 'earned' || t - (P.qSyncT || 0) > 15000) { P.qSyncT = t; G.questDirty(P); } }
}
function claimQuest(G, P, i) {
  ensureQuests(G, P); const q = P.d.quests.list[i | 0];
  if (!q) return { ok: false, why: 'No such quest.' }; if (q.claimed) return { ok: false, why: 'Already claimed.' }; if (q.prog < q.n) return { ok: false, why: 'Not finished yet.' };
  q.claimed = 1; grant(G, P, q.rw, 'Quest reward'); return { ok: true };
}

// ---------- new rats ----------
function giveRat(G, P, spec, src, opts) {
  opts = opts || {}; const place = opts.place || roomFor(G, P); if (!place) return null;
  const r = { id: newId(), sp: spec.sp, mut: spec.mut || null, wx: spec.wx || null, disco: spec.disco ? 1 : 0, lvl: 1, xp: 0, cap: G.cfg.ratMaxLevel, evo: spec.evo || 0, fav: 0, lock: 0, place, slot: -1, cos: {}, born: Date.now(), src: src || '' };
  G.db.st.ratInsert.run(r.id, P.id, r.sp, r.mut, r.wx, r.disco, r.lvl, r.xp, r.cap, r.evo, 0, 0, r.place, -1, '{}', r.born, r.src);
  P.rats.set(r.id, r);
  discover(G, P, r);
  P.dirty = true; return r;
}
function removeRat(G, P, r) { // returns its cosmetics to the owner and forgets it
  for (const s in r.cos) if (r.cos[s]) P.d.cos[r.cos[s]] = (P.d.cos[r.cos[s]] || 0) + 1;
  G.db.st.ratDelete.run(r.id, P.id); P.rats.delete(r.id);
  P.d.showcase.rats = P.d.showcase.rats.filter(x => x !== r.id); P.dirty = true;
}

function view(G, P) {
  ensureQuests(G, P);
  const d = P.d;
  return { id: P.id, name: P.name, money: P.money, level: P.level, xp: P.xp, rebirths: P.rebirths, caught: P.caught, trades: P.trades, color: P.color,
    d: { rods: d.rods, rod: d.rod, potions: d.potions, eff: d.eff, eggs: d.eggs, boxes: d.boxes, snacks: d.snacks, cos: d.cos, ach: d.ach, titles: d.titles, title: d.title, daily: dailyState(P), quests: d.quests, index: d.index, idxMs: d.idxMs, stats: d.stats, showcase: d.showcase, tokens: d.tokens },
    cap: cap(G, P), luck: luckOf(G, P), mps: mps(G, P).total, rats: [...P.rats.values()].map(ratView), achs: achList(P), hasPass: !!P.hasPass };
}

module.exports = { newData, newId, dayNow, load, save, saveRat, ratView, lookView, cap, countPlace, roomFor, eff, luckOf, mps, earnMods, bump, stat, addMoney, addXP, discover, indexCount, fieldsDone,
  checkAch, achList, grant, rewardMoney, dailyState, claimDaily, ensureQuests, questProgress, claimQuest, giveRat, removeRat, view, petLuck };
