'use strict';
// The game server: accounts, rooms (up to 20 players each), the lobby and fields, rat spawning and catching,
// money ticks, and every player request. The server decides every outcome.
const crypto = require('node:crypto');
const D = require('../shared/data.js');
const PL = require('./player.js');
const SAVES = require('./saves.js');
const { SP, RI, RARITIES, FI, FIELDS, ROD, POT, EGG, COS, MUTATIONS } = D;

const ROOM_MAX = 20;
const CODE_AB = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const hash = s => crypto.createHash('sha256').update(String(s)).digest('hex');
const rnd = Math.random;
const now = () => Date.now();

function create(G) {
  G.rooms = new Map(); G.sessions = new Set(); G.byPlayer = new Map(); let sid = 0, ratSeq = 0, chestSeq = 0;

  // ---------- messaging helpers ----------
  const send = (s, m) => { if (s && s.ws && s.ws.open) s.ws.send(JSON.stringify(m)); };
  G.send = send;
  G.sessionOf = P => G.byPlayer.get(P.id);
  G.toast = (P, t) => { const s = G.byPlayer.get(P.id); if (s) send(s, Object.assign({ t: 'toast' }, t)); };
  const syncQ = new Set(); let syncT = null;
  G.sync = P => { syncQ.add(P.id); if (!syncT) syncT = setImmediate(flushSync); };
  G.questDirty = P => G.sync(P);
  function flushSync() { syncT = null; for (const id of syncQ) { const s = G.byPlayer.get(id); if (s && s.P) { const v = PL.view(G, s.P); delete v.rats; send(s, Object.assign({ t: 'me' }, v)); } } syncQ.clear(); }
  G.sendRats = (P, up, del) => { const s = G.byPlayer.get(P.id); if (s) send(s, { t: 'rats', up: (up || []).map(PL.ratView), del: del || [] }); G.sync(P); };
  G.broadcast = (m, filter) => { const str = JSON.stringify(m); for (const s of G.sessions) if (s.P && (!filter || filter(s))) s.ws.send(str); };

  // ---------- rooms and areas ----------
  function newCode() { let c; do { c = ''; const b = crypto.randomBytes(6); for (let i = 0; i < 6; i++) c += CODE_AB[b[i] % CODE_AB.length]; } while (G.rooms.has(c)); return c; }
  function makeRoom(pub, owner, name) {
    const code = newCode(), room = { code, pub: !!pub, owner: owner || 0, name: name || (pub ? 'Public room' : 'Private room'), players: new Set(), areas: {}, made: now(), emptySince: now() };
    room.areas.lobby = { id: 'lobby', room, players: new Set(), rats: new Map(), chests: new Map() };
    for (const f of FIELDS) room.areas[f.id] = { id: f.id, room, field: f, L: D.fieldLayout(f.id), players: new Set(), rats: new Map(), chests: new Map(), spawnT: 0, chestT: now() + 1000 * D.FIELD_R, out: { rs: [], rp: [], rg: [] } };
    G.rooms.set(code, room); return room;
  }
  G.makeRoom = makeRoom;
  function publicRoom() {
    let best = null; for (const r of G.rooms.values()) if (r.pub && r.players.size < ROOM_MAX && (!best || r.players.size > best.players.size)) best = r;
    return best || makeRoom(true);
  }
  const roomInfo = r => ({ code: r.code, pub: r.pub, name: r.name, n: r.players.size, max: ROOM_MAX, owner: r.owner });
  function pubView(s) { const P = s.P; return { id: P.id, n: P.name, ti: P.d.title || '', c: P.color, lvl: P.level, reb: P.rebirths, p: s.pos, h: s.h, a: s.anim, rod: P.d.rod, pets: [...P.rats.values()].filter(r => r.place === 'eq').map(PL.lookView) }; }
  function rosterOf(room) { return [...room.players].map(s => ({ id: s.P.id, n: s.P.name, ti: s.P.d.title || '', c: s.P.color, lvl: s.P.level, reb: s.P.rebirths, area: s.area ? s.area.id : 'lobby', vc: s.voice ? 1 : 0, sc: { theme: s.P.d.showcase.theme, rats: s.P.d.showcase.rats.map(id => s.P.rats.get(id)).filter(Boolean).map(r => Object.assign(PL.lookView(r), { id: r.id })) } })); }
  function sendRoster(room) { const m = { t: 'roster', room: roomInfo(room), l: rosterOf(room) }; for (const s of room.players) send(s, m); }
  G.sendRoster = sendRoster;
  function enterRoom(s, room) {
    if (s.room === room) return;
    if (s.room) leaveRoom(s, true);
    s.room = room; room.players.add(s); room.emptySince = 0;
    enterArea(s, 'lobby');
    send(s, { t: 'room', room: roomInfo(room) }); sendRoster(room);
  }
  function leaveRoom(s, quiet) {
    const room = s.room; if (!room) return;
    G.trade && G.trade.cancelFor(s, 'left the room');
    leaveArea(s); room.players.delete(s); s.room = null;
    if (!room.players.size) room.emptySince = now();
    if (!quiet || room.players.size) sendRoster(room);
  }
  function areaSnapshot(a, s) {
    const t = now();
    return { t: 'area', a: a.id, you: s.pos, players: [...a.players].filter(x => x !== s).map(pubView), rats: [...a.rats.values()].map(r => ratNet(r)), chests: [...a.chests.values()].map(chestNet), srv: t };
  }
  function enterArea(s, aid) {
    const a = s.room.areas[aid]; if (!a) return;
    leaveArea(s);
    const wasEmpty = !a.players.size;
    s.area = a; a.players.add(s); s.catching = null;
    const L = a.L; const sp = aid === 'lobby' ? [D.LOBBY.spawn[0] + rnd() * 4 - 2, 0, D.LOBBY.spawn[1] + rnd() * 3] : [L.spawn[0] + rnd() * 4 - 2, 0, L.spawn[1] + rnd() * 3];
    s.pos = sp; s.h = aid === 'lobby' ? Math.PI : 0; s.lastMv = now();
    if (a.field && a.rats.size < 6) for (let i = 0; i < 8; i++) spawnRat(a); // a field wakes up with some rats in it
    send(s, areaSnapshot(a, s));
    if (a.field && wasEmpty) { a.out.rs = []; a.out.rp = []; a.out.rg = []; }
    const pv = pubView(s); for (const o of a.players) if (o !== s) send(o, { t: 'pj', p: pv });
    if (a.field) { const P = s.P; if (!P.d.fieldsVisited[aid]) { P.d.fieldsVisited[aid] = 1; PL.questProgress(G, P, 'fieldsToday', 1); } }
  }
  function leaveArea(s) {
    const a = s.area; if (!a) return;
    if (s.catching) releaseCatch(s, false);
    a.players.delete(s); s.area = null;
    for (const o of a.players) send(o, { t: 'pl', id: s.P.id });
    if (a.field && !a.players.size) { a.rats.clear(); a.chests.clear(); } // empty fields sleep
  }

  // ---------- rats in the fields ----------
  const ratNet = r => ({ id: r.id, sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco, st: r.st, ax: +r.ax.toFixed(2), az: +r.az.toFixed(2), bx: +r.bx.toFixed(2), bz: +r.bz.toFixed(2), t0: r.t0, t1: r.t1, by: r.by || 0, ev: r.ev || 0 });
  const ratPos = (r, t) => { if (t >= r.t1 || r.t1 <= r.t0) return [r.bx, r.bz]; const k = (t - r.t0) / (r.t1 - r.t0); return [r.ax + (r.bx - r.ax) * k, r.az + (r.bz - r.az) * k]; };
  function luckRoller(a) { const ps = [...a.players]; return ps.length ? ps[(rnd() * ps.length) | 0] : null; }
  function spawnRat(a, forced) {
    const L = a.L, inv = G.events.invasion(), ev = G.events.effects(); let x, z, tries = 0;
    do { x = (rnd() * 2 - 1) * (L.R - 6); z = (rnd() * 2 - 1) * (L.R - 6); tries++; } while (tries < 40 && (D.blocked(L, x, z, 1.2) || [...a.players].some(s => Math.hypot(s.pos[0] - x, s.pos[2] - z) < 9)));
    if (tries >= 40) return null;
    const roller = luckRoller(a), luck = roller ? PL.luckOf(G, roller.P) : 1;
    let sp = forced && forced.sp, rid;
    if (!sp) {
      if (inv && rnd() < 0.5) { const list = D.SPECIES.filter(s => s.inv); sp = list[(rnd() * list.length) | 0].id; }
      else if (ev.secret && (a.id === 'omega' || a.id === 'secret') && rnd() < 0.004) { const list = D.SPECIES.filter(s => s.secret); sp = list[(rnd() * list.length) | 0].id; }
      else { const w = D.spawnWeights(G.cfg, a.id, luck, ev); rid = RARITIES[D.pickWeighted(w, rnd)].id; const list = D.speciesFor(rid, a.id); if (!list.length) return null; sp = list[(rnd() * list.length) | 0].id; }
    }
    const mp = roller && PL.eff(roller.P, 'mutation') ? PL.eff(roller.P, 'mutation').mult : 1;
    const m = forced && forced.muts ? forced.muts : D.rollMutations(G.cfg, ev, mp, rnd);
    const rr = RI[SP[sp].r], t = now();
    const r = { id: (++ratSeq).toString(36), sp, mut: m.mut || null, wx: m.wx || null, disco: m.disco ? 1 : 0, ax: x, az: z, bx: x, bz: z, t0: t, t1: t, idle: t + 500 + rnd() * 2000, st: 'w', dies: t + rr.life * 1000 * (forced ? 2 : 1) * (inv ? 1.3 : 1), ev: forced ? 1 : (SP[sp].inv ? 2 : 0) };
    a.rats.set(r.id, r); a.out.rs.push(ratNet(r));
    if (rr.i >= 7 && !forced) G.events.rareSpawn && G.events.rareSpawn(a, r);
    return r;
  }
  G.spawnRat = spawnRat;
  function moveRat(a, r, t, flee, from) {
    const L = a.L, [x, z] = ratPos(r, t); let bx = x, bz = z, ok = false;
    for (let i = 0; i < 12 && !ok; i++) {
      let ang = rnd() * Math.PI * 2; const d = flee ? 10 + rnd() * 6 : 5 + rnd() * 10;
      if (flee && from) ang = Math.atan2(x - from[0], z - from[2]) + (rnd() - 0.5) * 1.2;
      bx = x + Math.sin(ang) * d; bz = z + Math.cos(ang) * d;
      ok = !D.blocked(L, bx, bz, 1.0);
      if (ok) for (let k = 1; k < 4; k++) if (D.blocked(L, x + (bx - x) * k / 4, z + (bz - z) * k / 4, 0.6)) { ok = false; break; }
    }
    if (!ok) { bx = x; bz = z; }
    const spd = flee ? 7 : 1.4 + rnd() * 1.4 + RI[SP[r.sp].r].i * 0.12, dd = Math.hypot(bx - x, bz - z);
    r.ax = x; r.az = z; r.bx = bx; r.bz = bz; r.t0 = t; r.t1 = t + (dd / spd) * 1000; r.idle = r.t1 + (flee ? 300 : 700 + rnd() * 3200);
    a.out.rp.push([r.id, +x.toFixed(2), +z.toFixed(2), +bx.toFixed(2), +bz.toFixed(2), r.t0, Math.round(r.t1), r.st]);
  }
  function removeRatFromArea(a, r, why, by) { a.rats.delete(r.id); a.out.rg.push([r.id, why, by || 0]); }

  // ---------- catching ----------
  function rodOf(P) { const rod = ROD[P.d.rod] || ROD.wood; return Object.assign({}, rod, G.cfg.rods[rod.id] || {}); }
  function catchOdds(P, r) {
    const rod = rodOf(P), rr = RI[SP[r.sp].r], cp = PL.eff(P, 'catch');
    return Math.min(0.98, Math.max(0.05, rod.success - rr.diff + (cp ? 0.05 : 0) + (G.cfg.catchBonus || 0)));
  }
  function catchTime(P, r) { const rod = rodOf(P), rr = RI[SP[r.sp].r], cp = PL.eff(P, 'catch'); return rr.time / rod.speed / (cp ? cp.mult : 1); }
  function releaseCatch(s, flee) {
    const c = s.catching; s.catching = null; if (!c || !s.area) return;
    const r = s.area.rats.get(c.id); if (!r || r.st !== 'h' || r.by !== s.P.id) return;
    r.st = 'w'; r.by = 0; const t = now(); r.t0 = r.t1 = t; r.idle = t;
    if (flee) moveRat(s.area, r, t, true, s.pos); else s.area.out.rp.push([r.id, +r.bx.toFixed(2), +r.bz.toFixed(2), +r.bx.toFixed(2), +r.bz.toFixed(2), t, t, 'w']);
  }
  const H = {}; // message handlers: H[type](session, msg)
  H.cast = (s, m) => {
    const a = s.area, P = s.P; if (!a || !a.field) return;
    if (s.catching) return send(s, { t: 'castNo', why: 'You are already catching a rat.' });
    const r = a.rats.get(String(m.r)); if (!r || r.st !== 'w') return send(s, { t: 'castNo', why: 'That rat got away.', r: m.r });
    if (!PL.roomFor(G, P)) return send(s, { t: 'castNo', why: 'Your inventory and storage are full. Sell or store some rats first.' });
    const t = now(), [x, z] = ratPos(r, t), rod = rodOf(P);
    if (Math.hypot(x - s.pos[0], z - s.pos[2]) > rod.range + 4) return send(s, { t: 'castNo', why: 'Too far away. Get closer!', r: r.id });
    r.st = 'h'; r.by = P.id; r.ax = r.bx = x; r.az = r.bz = z; r.t0 = r.t1 = t;
    const dur = catchTime(P, r), p = catchOdds(P, r);
    s.catching = { id: r.id, start: t, dur };
    a.out.rp.push([r.id, +x.toFixed(2), +z.toFixed(2), +x.toFixed(2), +z.toFixed(2), t, t, 'h', P.id]);
    send(s, { t: 'castOk', r: r.id, dur, p });
  };
  H.uncast = s => { if (s.catching) { releaseCatch(s, true); send(s, { t: 'miss', why: 'The line snapped!' }); } };
  H.reel = (s, m) => {
    const c = s.catching, a = s.area, P = s.P; if (!c || !a || String(m.r) !== c.id) return;
    const t = now(); if (t < c.start + c.dur * 1000 - 400) return send(s, { t: 'castNo', why: 'Keep reeling!' });
    const r = a.rats.get(c.id); s.catching = null; if (!r || r.st !== 'h' || r.by !== P.id) return send(s, { t: 'miss', why: 'It got away.' });
    if (rnd() < catchOdds(P, r)) {
      const rat = G.db.tx(() => {
        const got = PL.giveRat(G, P, { sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco }, 'catch');
        if (!got) return null;
        P.caught++; const rr = RI[SP[r.sp].r]; PL.bump(G, P, 'caught');
        if (rr.i >= 2) PL.bump(G, P, 'caughtRare');
        if (r.mut || r.wx || r.disco) PL.bump(G, P, 'mutCaught');
        PL.addXP(G, P, rr.xp * (r.mut ? 2 : 1));
        PL.checkAch(G, P); PL.save(G, P); return got;
      });
      if (!rat) { r.st = 'w'; r.by = 0; moveRat(a, r, t, true, s.pos); return send(s, { t: 'miss', why: 'No room for it! Your inventory and storage are full.' }); }
      removeRatFromArea(a, r, 'caught', P.id);
      send(s, { t: 'got', rat: PL.ratView(rat), xp: RI[SP[r.sp].r].xp });
      G.sendRats(P, [rat]);
      if (RI[SP[r.sp].r].i >= 7) G.events.announce({ kind: 'rare', text: P.name + ' caught ' + D.ratName(rat) + '!', col: RI[SP[r.sp].r].col, dur: 8 });
    } else {
      r.st = 'w'; r.by = 0; moveRat(a, r, t, true, s.pos);
      send(s, { t: 'miss', why: 'It got away!' });
    }
  };

  // ---------- movement and travel ----------
  H.mv = (s, m) => {
    if (!s.area || !Array.isArray(m.p)) return;
    const t = now(), dt = Math.max(0.05, (t - (s.lastMv || t)) / 1000), x = +m.p[0], y = +m.p[1], z = +m.p[2];
    if (![x, y, z].every(Number.isFinite)) return;
    const sp = PL.eff(s.P, 'speed') ? 1.5 : 1, maxd = 13 * sp * dt + 3, d = Math.hypot(x - s.pos[0], z - s.pos[2]), lim = s.area.id === 'lobby' ? D.LOBBY.R + 2 : D.FIELD_R + 1;
    if (d > maxd || Math.abs(x) > lim || Math.abs(z) > lim) { send(s, { t: 'pos', p: s.pos }); return; } // too fast: put them back
    s.pos = [x, Math.max(-50, Math.min(200, y)), z]; s.h = +m.h || 0; s.anim = (m.a | 0) & 15; s.lastMv = t; s.moved = true;
  };
  H.go = (s, m) => {
    const aid = String(m.a || ''); if (!s.room || !s.room.areas[aid] || (s.area && s.area.id === aid)) return;
    const f = FI[aid]; if (f && !D.canEnter(f, s.P.level, s.P.rebirths)) return send(s, { t: 'err', text: D.lockText(f) });
    G.trade && G.trade.cancelFor(s, 'left the lobby');
    enterArea(s, aid); sendRoster(s.room);
  };

  // ---------- chests ----------
  const chestNet = c => ({ id: c.id, x: +c.x.toFixed(2), z: +c.z.toFixed(2), k: c.k });
  function spawnChest(a) {
    let x, z, tries = 0; do { x = (rnd() * 2 - 1) * (a.L.R - 8); z = (rnd() * 2 - 1) * (a.L.R - 8); } while (++tries < 40 && D.blocked(a.L, x, z, 2));
    if (tries >= 40) return;
    const c = { id: 'c' + (++chestSeq).toString(36), x, z, k: a.field.i < 3 ? 0 : a.field.i < 6 ? 1 : 2, dies: now() + 180000 };
    a.chests.set(c.id, c); for (const s of a.players) send(s, { t: 'chs', c: chestNet(c) });
  }
  H.chest = (s, m) => {
    const a = s.area; if (!a || !a.field) return; const c = a.chests.get(String(m.id)); if (!c) return send(s, { t: 'err', text: 'Someone already opened that chest.' });
    if (Math.hypot(c.x - s.pos[0], c.z - s.pos[2]) > 5) return send(s, { t: 'err', text: 'Walk up to the chest to open it.' });
    a.chests.delete(c.id); for (const o of a.players) send(o, { t: 'chg', id: c.id, by: s.P.id });
    const P = s.P, fi = a.field.i, roll = rnd(), rw = {}; const ev = G.events.active().length > 0;
    const base = Math.round(Math.max(500, PL.mps(G, P, false).total * 120) * (1 + fi * 0.6) * (c.k + 1));
    if (roll < 0.40) rw.money = base;
    else if (roll < 0.65) { rw.potion = D.POTIONS[(rnd() * D.POTIONS.length) | 0].id; rw.money = Math.round(base / 3); }
    else if (roll < 0.80) { rw.potion = fi >= 4 && rnd() < 0.4 ? 'superluck' : 'luck'; rw.money = Math.round(base / 2); }
    else if (roll < 0.90) rw.mystery = 1;
    else if (roll < 0.96) { const list = D.COSMETICS.filter(x => x.src === 'shop' && (G.cfg.cosPrices[x.id] || 0) < 5e6); rw.cos = list[(rnd() * list.length) | 0].id; }
    else { const next = D.RODS.find(r => !P.d.rods.includes(r.id) && r.i <= 2 + Math.floor(fi / 2)); if (next) rw.rod = next.id; else rw.money = base * 3; }
    if (ev) rw.tokens = 2 + c.k * 2;
    G.db.tx(() => { const got = PL.grant(G, P, rw, 'Treasure chest!'); PL.bump(G, P, 'chests'); PL.checkAch(G, P); PL.save(G, P); send(s, { t: 'chestOpen', id: c.id, got, k: c.k }); });
  };

  // ---------- the world tick (10 times a second) ----------
  let lastEcon = now(), lastSave = now(), lastRatXp = now(), lastDev = 0;
  function tick() {
    const t = now();
    for (const room of G.rooms.values()) {
      if (!room.players.size && room.emptySince && t - room.emptySince > 60000 && G.rooms.size > 1 && !(room.pub && [...G.rooms.values()].filter(r => r.pub).length === 1)) { G.rooms.delete(room.code); continue; }
      for (const aid in room.areas) {
        const a = room.areas[aid]; if (!a.players.size) continue;
        if (a.field) {
          const inv = G.events.invasion(), max = Math.round(G.cfg.maxRatsPerField * (inv ? 2.5 : 1)), every = G.cfg.spawnEvery * 1000 / (inv ? 3 : 1);
          if (a.rats.size < max && t - a.spawnT > every) { a.spawnT = t; spawnRat(a); }
          for (const r of a.rats.values()) {
            if (r.st === 'h') { const s = [...a.players].find(x => x.P.id === r.by); if (!s || !s.catching || t > s.catching.start + s.catching.dur * 1000 + 15000) { if (s) { s.catching = null; send(s, { t: 'miss', why: 'It wriggled free.' }); } r.st = 'w'; r.by = 0; r.idle = t; } continue; }
            if (t > r.dies && t >= r.t1) { removeRatFromArea(a, r, 'gone'); continue; }
            if (r.st === 'f' && t >= r.t1) r.st = 'w';
            if (t >= r.idle) moveRat(a, r, t, false);
          }
          for (const c of a.chests.values()) if (t > c.dies) { a.chests.delete(c.id); for (const s of a.players) send(s, { t: 'chg', id: c.id }); }
          if (t > a.chestT) { a.chestT = t + 1000 * (G.cfg.chestEvery[0] + rnd() * (G.cfg.chestEvery[1] - G.cfg.chestEvery[0])); if (a.chests.size < G.cfg.maxChests) spawnChest(a); }
          const o = a.out;
          if (o.rs.length || o.rp.length || o.rg.length) { const msg = JSON.stringify({ t: 'rw', rs: o.rs, rp: o.rp, rg: o.rg, srv: t }); for (const s of a.players) s.ws.send(msg); o.rs = []; o.rp = []; o.rg = []; }
        }
        // other players' positions
        const moved = [...a.players].filter(s => s.moved);
        if (moved.length) { const l = moved.map(s => [s.P.id, +s.pos[0].toFixed(2), +s.pos[1].toFixed(2), +s.pos[2].toFixed(2), +s.h.toFixed(2), s.anim | 0]); moved.forEach(s => { s.moved = false; }); const msg = JSON.stringify({ t: 'pm', l }); for (const s of a.players) s.ws.send(msg); }
      }
    }
    if (t - lastEcon >= 1000) { const dt = Math.min(5, (t - lastEcon) / 1000); lastEcon = t; econ(dt, t); }
    if (t - lastSave >= 5000) { lastSave = t; saveAll(false); }
    if (G.devSaves && t - lastDev >= 8000) { lastDev = t; devPush(); }
    if (t - lastRatXp >= 30000) { lastRatXp = t; saveRatXp(); }
    G.events.tick(t);
  }
  // money and rat XP every second
  function econ(dt, t) {
    for (const s of G.sessions) {
      const P = s.P; if (!P) continue;
      const m = PL.mps(G, P, true).total; if (m > 0) PL.addMoney(G, P, m * dt, true);
      for (const cat in P.d.eff) if (P.d.eff[cat].ends <= t) { const e = P.d.eff[cat]; delete P.d.eff[cat]; G.toast(P, { kind: 'potion', text: (POT[e.id] ? POT[e.id].n : 'Potion') + ' wore off.' }); G.sync(P); }
      const lv = []; for (const r of P.rats.values()) if (r.place === 'slot' || r.place === 'eq') if (ratXp(P, r, dt)) lv.push(r);
      if (lv.length) { G.db.tx(() => { for (const r of lv) PL.saveRat(G, P, r); }); G.sendRats(P, lv); }
      send(s, { t: 'money', m: P.money, mps: m });
      if (P.d.stats.peakMoney >= 1e6 && !P.d.ach.rich || P.d.stats.peakMoney >= 1e9 && !P.d.ach.billion) PL.checkAch(G, P);
    }
  }
  function ratXp(P, r, amt) {
    if (r.lvl >= r.cap) { r.xp = 0; return false; }
    r.xp += amt; let up = false;
    while (r.lvl < r.cap && r.xp >= D.ratXpNeed(r.lvl)) { r.xp -= D.ratXpNeed(r.lvl); r.lvl++; up = true; PL.bump(G, P, 'ratLevels'); if ([10, 25, 50, 75, 100].includes(r.lvl)) G.toast(P, { kind: 'ratlvl', text: SP[r.sp].n + ' reached level ' + r.lvl + '!', rat: r.id }); }
    if (r.lvl >= r.cap) r.xp = 0;
    return up;
  }
  G.ratXp = ratXp;
  function saveRatXp() { for (const s of G.sessions) if (s.P) { const P = s.P; G.db.tx(() => { for (const r of P.rats.values()) if (r.place === 'slot' || r.place === 'eq') PL.saveRat(G, P, r); }); } }
  function saveAll(force) { G.db.tx(() => { for (const s of G.sessions) if (s.P && (s.P.dirty || force)) PL.save(G, s.P); }); }
  G.saveAll = saveAll;

  // ---------- accounts ----------
  const validName = n => typeof n === 'string' && /^[A-Za-z0-9_ ]{3,16}$/.test(n.trim()) && !/^ | $|  /.test(n.trim());
  function passHash(pass, salt) { return crypto.scryptSync(String(pass), salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex'); }
  function issueToken(acc) { const tok = crypto.randomBytes(32).toString('hex'); G.db.st.accToken.run(hash(tok), now(), acc.id); return tok; }
  function register(s, m) {
    const name = String(m.name || '').trim();
    if (!validName(name)) return send(s, { t: 'authErr', text: 'Names are 3 to 16 letters, numbers or spaces.' });
    if (G.db.st.accByName.get(name)) return send(s, { t: 'authErr', text: 'That name is taken. Try another one.' });
    let ph = null, salt = null; if (m.pass) { if (String(m.pass).length < 4) return send(s, { t: 'authErr', text: 'Passwords need at least 4 characters.' }); salt = crypto.randomBytes(16).toString('hex'); ph = passHash(m.pass, salt); }
    const tok = crypto.randomBytes(32).toString('hex'), t = now();
    const col = ['#ff9f1a', '#45b0ff', '#5fdc6a', '#ff5c8a', '#b876ff', '#ffcf3a', '#2fd8c0'][(rnd() * 7) | 0];
    let id; G.db.tx(() => { const r = G.db.st.accInsert.run(name, ph, salt, hash(tok), t, t); id = Number(r.lastInsertRowid); G.db.st.plInsert.run(id, 0, JSON.stringify(PL.newData()), 0, col); });
    login(s, G.db.st.accById.get(id), tok);
  }
  function loginPass(s, m) {
    const acc = G.db.st.accByName.get(String(m.name || '').trim());
    if (!acc || !acc.pass_hash) return send(s, { t: 'authErr', text: acc ? 'That player has no password yet. Log in on your first device and set one in Settings.' : 'No player with that name.' });
    if (s.fails > 6) return send(s, { t: 'authErr', text: 'Too many tries. Wait a minute.' });
    const ok = crypto.timingSafeEqual(Buffer.from(passHash(m.pass || '', acc.pass_salt), 'hex'), Buffer.from(acc.pass_hash, 'hex'));
    if (!ok) { s.fails = (s.fails || 0) + 1; return send(s, { t: 'authErr', text: 'Wrong password.' }); }
    login(s, acc, issueToken(acc));
  }
  function login(s, acc, tok) {
    if (acc.banned) return send(s, { t: 'authErr', text: 'This player is banned from the server.' });
    const old = G.byPlayer.get(acc.id);
    if (old && old !== s) { send(old, { t: 'kicked', text: 'You logged in somewhere else.' }); drop(old); old.ws.close(4000, 'replaced'); }
    const P = PL.load(G, acc); if (!P) return send(s, { t: 'authErr', text: 'Could not load your save.' });
    P.hasPass = !!acc.pass_hash;
    s.P = P; P.online = true; G.byPlayer.set(P.id, s);
    // offline earnings: 10% of what the money slots would have made, from the server's clock only
    let offline = null; const t = now(), lastSeen = P.last_seen;
    if (P.last_seen > 0) {
      const secs = Math.min((t - P.last_seen) / 1000, G.cfg.offlineMaxHours * 3600);
      if (secs > 60) {
        const base = PL.mps(G, P, false).total, e = P.d.eff.money; let extra = 0;
        if (e && e.ends > P.last_seen) extra = base * (e.mult - 1) * Math.min(secs, (e.ends - P.last_seen) / 1000);
        const amt = G.cfg.offlineRate * (base * secs + extra);
        const lv = []; for (const r of P.rats.values()) if (r.place === 'slot' || r.place === 'eq') if (ratXp(P, r, secs * G.cfg.offlineRate)) lv.push(r);
        G.db.tx(() => { if (amt > 0) PL.addMoney(G, P, amt, true); for (const r of lv) PL.saveRat(G, P, r); P.last_seen = t; PL.save(G, P); });
        offline = { secs: Math.round(secs), amt, rate: G.cfg.offlineRate, capped: (t - lastSeen) / 1000 > G.cfg.offlineMaxHours * 3600, away: Math.round((t - lastSeen) / 1000), maxH: G.cfg.offlineMaxHours };
      }
    }
    if (P.eggRefund) { const m = P.eggRefund; delete P.eggRefund; setTimeout(() => G.toast(P, { kind: 'ok', text: 'Eggs are gone from RAT CATCHERS.', sub: 'The eggs you had were turned into ' + D.fmtMoney(m) + '.' }), 2500); }
    P.last_seen = t; PL.ensureQuests(G, P); PL.checkAch(G, P); PL.save(G, P);
    send(s, { t: 'welcome', token: tok || undefined, you: PL.view(G, P), cfg: G.publicCfg(), srv: t, events: G.events.state(), ann: G.events.recent(), offline });
    let room = null; if (s.want && G.rooms.has(s.want) && G.rooms.get(s.want).players.size < ROOM_MAX) room = G.rooms.get(s.want);
    enterRoom(s, room || publicRoom());
  }
  function drop(s) {
    if (!s.P) return;
    const P = s.P;
    G.trade && G.trade.cancelFor(s, 'disconnected');
    leaveRoom(s);
    P.online = false; P.last_seen = now();
    try { G.db.tx(() => { for (const r of P.rats.values()) if (r.place === 'slot' || r.place === 'eq') PL.saveRat(G, P, r); PL.save(G, P); }); } catch (e) { console.error('save on leave failed', e); }
    if (G.byPlayer.get(P.id) === s) G.byPlayer.delete(P.id);
    s.P = null;
  }

  // ---------- device saves (a free host that forgets everything on restart) ----------
  // The player's device brings its save; the server hands it back every few seconds and the device keeps it.
  G.sid = crypto.randomBytes(6).toString('hex'); const devN = new Map();
  function devLogin(s, m) {
    const dev = String(m.dev || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
    if (dev.length < 6) return send(s, { t: 'authErr', text: 'This device has no player code yet. Reload the game.' });
    const b = SAVES.clean(m.blob); if (!b) return send(s, { t: 'authErr', text: 'Your save could not be read.' });
    const sy = m.sync && typeof m.sync === 'object' ? m.sync : null;
    let id = G.db.kvGet('dev:' + dev), acc = id && G.db.st.accById.get(id);
    // the server's copy is newer when this device missed some of this server's saves and has not played since
    const keep = acc && sy && sy.sid === G.sid && (devN.get(id) || 0) > (sy.n | 0);
    const old = acc && G.byPlayer.get(id); if (old && old !== s) { send(old, { t: 'kicked', text: 'You opened the game somewhere else.' }); drop(old); old.ws.close(4000, 'replaced'); }
    try {
      G.db.tx(() => {
        const base = validName(b.name) ? b.name.trim() : 'Catcher ' + dev.slice(0, 3); let n = base, i = 2;
        for (;;) { const o = G.db.st.accByName.get(n); if (!o || (acc && o.id === acc.id)) break; n = base.slice(0, 13) + ' ' + i++; }
        if (!acc) { const t = now(); const r = G.db.st.accInsert.run(n, null, null, '', t, t); id = Number(r.lastInsertRowid); G.db.kvSet('dev:' + dev, id); acc = G.db.st.accById.get(id); }
        if (!keep) SAVES.writeAcc(G, id, b);
      });
    } catch (e) { console.error('device save', e); return send(s, { t: 'authErr', text: 'Your save could not be loaded on the server.' }); }
    s.dev = dev; acc = G.db.st.accById.get(id);
    login(s, acc, null);
    if (s.P) devSend(s);
  }
  function devSend(s) {
    const P = s.P; if (!P) return;
    G.db.tx(() => { for (const r of P.rats.values()) if (r.place === 'slot' || r.place === 'eq') PL.saveRat(G, P, r); PL.save(G, P); });
    const blob = SAVES.exportAcc(G, P.id); if (!blob) return;
    const n = (devN.get(P.id) || 0) + 1; devNSet(P.id, n);
    send(s, { t: 'save', blob, sync: { sid: G.sid, n } });
  }
  const devNSet = (id, n) => devN.set(id, n);
  function devPush() { for (const s of G.sessions) if (s.dev && s.P) { try { devSend(s); } catch (e) { console.error('device save push', e); } } }
  G.devSend = devSend;

  // ---------- connections ----------
  G.onConnection = ws => {
    const s = { id: ++sid, ws, P: null, room: null, area: null, pos: [0, 0, 0], h: 0, anim: 0, tokens: 60, last: now(), catching: null };
    G.sessions.add(s);
    ws.on('message', raw => {
      const t = now(); s.tokens = Math.min(80, s.tokens + (t - s.last) / 1000 * 40); s.last = t;
      if (--s.tokens < 0) { if (s.tokens < -200) ws.close(4008, 'slow down'); return; }
      let m; try { m = JSON.parse(raw); } catch (e) { return; }
      if (!m || typeof m.t !== 'string') return;
      try { handle(s, m); } catch (e) { console.error('handler', m.t, e); send(s, { t: 'err', text: 'Something went wrong on the server.' }); }
    });
    ws.on('close', () => { drop(s); G.sessions.delete(s); });
  };
  function handle(s, m) {
    if (m.t === 'ping') return send(s, { t: 'pong', c: m.c, s: now() });
    if (!s.P) {
      if (m.t === 'hello') {
        if (m.room) s.want = String(m.room).toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (G.devSaves && m.blob) return devLogin(s, m);
        if (m.token) { const acc = G.db.st.accByToken.get(hash(m.token)); if (acc) return login(s, acc, null); }
        return send(s, { t: 'auth' });
      }
      if (m.t === 'register') return register(s, m);
      if (m.t === 'login') return loginPass(s, m);
      return;
    }
    const f = H[m.t] || (G.trade && G.trade.H[m.t]); if (f) f(s, m);
  }
  G.H = H;

  // ---------- chat: text for everyone in the room, and voice-chat signaling between players ----------
  // The filter hides swear words, links, e-mail addresses and phone numbers (players are often kids).
  const BAD = /\b(f+u+c+k+\w*|sh+i+t+\w*|b+i+t+c+h+\w*|c+u+n+t+\w*|d+i+c+k+s?|p+u+s+s+y+|a+s+s+h+o+l+e+s?|bastard\w*|wh+o+r+e+s?|sl+u+t+s?|n+i+g+g+\w*|f+a+g+\w*|retard\w*|k+y+s+|porn\w*|sex+y?|nudes?|rape\w*)\b/gi;
  function cleanChat(t) {
    t = String(t || '').replace(/[\u0000-\u001f\u007f​-‏‪-‮]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120);
    t = t.replace(/\b(https?:\/\/|www\.)\S+/gi, '***').replace(/\b\S+\.(com|net|org|gg|io|co|me|tv|xyz|ly)(\/\S*)?\b/gi, '***').replace(/\S+@\S+\.\S+/g, '***').replace(/(\+?\d[\d\s().-]{7,}\d)/g, '***');
    return t.replace(BAD, w => w[0] + '*'.repeat(w.length - 1));
  }
  H.chat = (s, m) => {
    if (!s.room) return; const t = now(); s.chatT = (s.chatT || []).filter(x => t - x < 10000);
    if (s.chatT.length >= 5) return send(s, { t: 'err', text: 'Slow down a little before chatting again.' });
    const x = cleanChat(m.x); if (!x) return; s.chatT.push(t);
    const msg = { t: 'chat', id: s.P.id, n: s.P.name, c: s.P.color, x, at: t };
    for (const o of s.room.players) send(o, msg);
  };
  H.voice = (s, m) => { const v = m.on ? 1 : 0; if (!!s.voice === !!v) return; s.voice = v; if (s.room) sendRoster(s.room); };
  H.vsig = (s, m) => {
    if (!s.room || !s.voice || typeof m.d !== 'object' || !m.d) return;
    const raw = JSON.stringify(m.d); if (raw.length > 12000) return;
    const o = [...s.room.players].find(x => x.P && x.P.id === (m.to | 0)); if (!o || o === s || !o.voice) return;
    send(o, { t: 'vsig', from: s.P.id, d: m.d });
  };

  // ---------- rooms ----------
  H.rooms = s => send(s, { t: 'roomList', l: [...G.rooms.values()].filter(r => r.pub).map(roomInfo) });
  H.mkroom = (s, m) => { const r = makeRoom(!!m.pub, s.P.id, m.pub ? s.P.name + "'s room" : s.P.name + "'s private room"); enterRoom(s, r); send(s, { t: 'toast', kind: 'room', text: 'Room created. Code: ' + r.code }); };
  H.join = (s, m) => {
    const code = String(m.code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''), r = G.rooms.get(code);
    if (!r) return send(s, { t: 'err', text: 'No room with the code ' + code + '.' });
    if (r === s.room) return send(s, { t: 'err', text: 'You are already in that room.' });
    if (r.players.size >= ROOM_MAX) return send(s, { t: 'err', text: 'That room is full (20 players).' });
    enterRoom(s, r);
  };
  H.joinPub = s => { let best = null; for (const r of G.rooms.values()) if (r.pub && r !== s.room && r.players.size < ROOM_MAX && (!best || r.players.size > best.players.size)) best = r; enterRoom(s, best || makeRoom(true)); };
  H.invite = (s, m) => {
    const o = [...G.sessions].find(x => x.P && x.P.name.toLowerCase() === String(m.name || '').trim().toLowerCase());
    if (!o) return send(s, { t: 'err', text: 'That player is not online right now.' });
    if (o === s) return; if (o.room === s.room) return send(s, { t: 'err', text: o.P.name + ' is already in your room.' });
    send(o, { t: 'invited', from: s.P.name, code: s.room.code, priv: !s.room.pub }); send(s, { t: 'toast', kind: 'room', text: 'Invite sent to ' + o.P.name + '.' });
  };

  // ---------- inventory ----------
  const own = (s, id) => s.P.rats.get(String(id || ''));
  function busyInTrade(s, r) { return G.trade && G.trade.holds(s, r.id); }
  H.fav = (s, m) => { const r = own(s, m.id); if (!r) return; r.fav = m.v ? 1 : 0; PL.saveRat(G, s.P, r); G.sendRats(s.P, [r]); };
  H.lock = (s, m) => {
    const r = own(s, m.id); if (!r) return;
    if (!m.v && r.lock && RI[SP[r.sp].r].i >= 4 && !m.confirm) return send(s, { t: 'confirm', what: 'unlock', id: r.id, text: 'Unlock ' + D.ratName(r) + '? Unlocked rats can be sold, traded and evolved.' });
    r.lock = m.v ? 1 : 0; PL.saveRat(G, s.P, r); G.sendRats(s.P, [r]);
  };
  H.sell = (s, m) => {
    const P = s.P, ids = Array.isArray(m.ids) ? m.ids.slice(0, 300) : [m.id], list = ids.map(id => own(s, id)).filter(Boolean);
    if (!list.length) return;
    if (list.some(r => r.lock)) return send(s, { t: 'err', text: 'Locked rats can’t be sold. Unlock them first.' });
    if (list.some(r => busyInTrade(s, r))) return send(s, { t: 'err', text: 'One of those rats is in a trade.' });
    const favs = list.filter(r => r.fav); if (favs.length && !m.confirmFav) return send(s, { t: 'confirm', what: 'sellfav', ids: list.map(r => r.id), text: 'Sell ' + favs.length + ' favorite rat' + (favs.length > 1 ? 's' : '') + '? Favorites are usually rats you want to keep.' });
    let total = 0;
    G.db.tx(() => { for (const r of list) { total += D.sellPrice(G.cfg, r); PL.removeRat(G, P, r); } PL.addMoney(G, P, total, false); PL.bump(G, P, 'sold', list.length); PL.save(G, P); });
    send(s, { t: 'sold', n: list.length, money: total }); G.sendRats(P, [], list.map(r => r.id));
  };
  function moveTo(s, r, place, slot) {
    const P = s.P, c = PL.cap(G, P);
    if (busyInTrade(s, r)) return 'That rat is in a trade.';
    if (place === 'inv' && r.place !== 'inv' && PL.countPlace(P, 'inv') >= c.inv) return 'Your inventory is full.';
    if (place === 'sto' && r.place !== 'sto' && PL.countPlace(P, 'sto') >= c.storage) return 'Your storage is full. Upgrade it in the shop.';
    if (place === 'eq' && r.place !== 'eq' && PL.countPlace(P, 'eq') >= c.equip) return 'You can equip ' + c.equip + ' rat' + (c.equip > 1 ? 's' : '') + '. Unequip one first.';
    if (place === 'slot') {
      if (slot == null || slot < 0 || slot >= c.slots) return 'That money slot is locked.';
      const other = [...P.rats.values()].find(x => x.place === 'slot' && x.slot === slot);
      if (other && other !== r) { other.place = r.place === 'slot' ? 'inv' : (r.place || 'inv'); other.slot = -1; if (other.place === 'inv' && PL.countPlace(P, 'inv') >= c.inv) other.place = 'sto'; PL.saveRat(G, P, other); }
    }
    r.place = place; r.slot = place === 'slot' ? slot : -1; PL.saveRat(G, P, r); return null;
  }
  const placeH = (place) => (s, m) => {
    const r = own(s, m.id); if (!r) return;
    const before = [...s.P.rats.values()].filter(x => x.place === 'slot').map(x => x.id);
    const err = G.db.tx(() => moveTo(s, r, place, m.slot == null ? null : m.slot | 0)); if (err) return send(s, { t: 'err', text: err });
    const changed = [r, ...before.map(id => s.P.rats.get(id)).filter(x => x && x !== r && x.place !== 'slot')];
    G.sendRats(s.P, changed); if (place === 'eq' || r.place === 'eq' || changed.some(x => x.place === 'eq')) petsChanged(s);
  };
  H.store = placeH('sto'); H.unstore = placeH('inv'); H.slot = placeH('slot'); H.unslot = placeH('inv'); H.equip = placeH('eq'); H.unequip = (s, m) => { placeH('inv')(s, m); petsChanged(s); };
  function petsChanged(s) { if (!s.area) return; const pv = pubView(s); for (const o of s.area.players) send(o, { t: 'pu', p: pv }); }
  G.petsChanged = petsChanged;

  // ---------- shop ----------
  function pay(P, price) { if (!(price >= 0) || P.money < price) return false; P.money -= price; P.dirty = true; return true; }
  H.buy = (s, m) => {
    const P = s.P, cfg = G.cfg, kind = String(m.kind || ''), id = String(m.id || ''), n = Math.max(1, Math.min(99, m.n | 0 || 1));
    const fail = text => send(s, { t: 'err', text });
    const done = (text, extra) => { PL.save(G, P); G.sync(P); send(s, Object.assign({ t: 'bought', kind, id, text }, extra || {})); };
    G.db.tx(() => {
      if (kind === 'rod') { const r = D.ROD[id]; if (!r) return fail('Unknown rod.'); if (P.d.rods.includes(id)) return fail('You already own the ' + r.n + '.'); if (!pay(P, cfg.rods[id].price)) return fail('Not enough money.'); P.d.rods.push(id); P.d.rod = id; return done('You bought the ' + r.n + '!'); }
      if (kind === 'potion') { const p = POT[id]; if (!p) return fail('Unknown potion.'); if (!pay(P, cfg.potions[id].price * n)) return fail('Not enough money.'); P.d.potions[id] = (P.d.potions[id] || 0) + n; return done('You bought ' + n + 'x ' + p.n + '.'); }
      if (kind === 'slot') { const c = PL.cap(G, P); if (c.slots >= cfg.maxSlots) return fail('All 12 money slots are unlocked.'); if (!pay(P, D.slotPrice(cfg, c.slots))) return fail('Not enough money.'); P.d.slots++; return done('Money slot ' + (c.slots + 1) + ' unlocked!'); }
      if (kind === 'storage') { const c = PL.cap(G, P); if (c.storage >= cfg.maxStorage) return fail('Storage is as big as it gets.'); if (!pay(P, D.storagePrice(cfg, c.storage))) return fail('Not enough money.'); P.d.storage++; return done('Storage upgraded to ' + (c.storage + cfg.storageStep) + ' spaces.'); }
      if (kind === 'inv') { const c = PL.cap(G, P); if (c.inv >= cfg.maxInventory) return fail('Your inventory is as big as it gets.'); if (!pay(P, D.inventoryPrice(cfg, c.inv))) return fail('Not enough money.'); P.d.inv++; return done('Inventory upgraded to ' + (c.inv + cfg.inventoryStep) + ' spaces.'); }
      if (kind === 'equip') { const c = PL.cap(G, P); if (c.equip >= cfg.maxEquip) return fail('You can already equip ' + cfg.maxEquip + ' rats.'); if (!pay(P, cfg.equipPrices[c.equip - cfg.startEquip])) return fail('Not enough money.'); P.d.equip++; return done('You can now equip ' + (c.equip + 1) + ' rats.'); }
      if (kind === 'cos') { const c = COS[id], price = cfg.cosPrices[id]; if (!c || !price) return fail('That cosmetic is not for sale.'); if (c.src === 'promo' && !(cfg.promo.on && cfg.promo.items.includes(id) && (!cfg.promo.ends || cfg.promo.ends > now()))) return fail('That promotion has ended.'); if (!pay(P, price)) return fail('Not enough money.'); P.d.cos[id] = (P.d.cos[id] || 0) + 1; return done('You bought ' + c.n + '!'); }
      if (kind === 'tokens') { const c = COS[id]; if (!c || !c.tokens) return fail('Not in the event shop.'); if (P.d.tokens < c.tokens) return fail('Not enough event tokens.'); P.d.tokens -= c.tokens; P.d.cos[id] = (P.d.cos[id] || 0) + 1; return done('You got ' + c.n + '!'); }
      if (kind === 'mystery') { if (!pay(P, cfg.mysteryPrice * n)) return fail('Not enough money.'); P.d.boxes += n; return done('You bought ' + n + ' Mystery Box' + (n > 1 ? 'es' : '') + '.'); }
      if (kind === 'snack') { if (!pay(P, snackPrice(P) * n)) return fail('Not enough money.'); P.d.snacks += n; return done('You bought ' + n + ' Rat Snack' + (n > 1 ? 's' : '') + '.'); }
      if (kind === 'egg') return fail('Eggs are gone from RAT CATCHERS.');
      if (kind === 'egg_removed') { const e = EGG[id]; if (!e) return fail('Unknown egg.'); if (e.limited && !ltdOn()) return fail('The Limited-Time Egg is not available right now.'); if (!PL.roomFor(G, P)) return fail('No room for a new rat. Sell or store some first.'); if (!pay(P, cfg.eggs[id].price)) return fail('Not enough money.'); const rat = hatch(s, id); if (!rat) throw new Error('hatch failed'); return done(null, { rat: PL.ratView(rat) }); }
      return fail('That is not for sale.');
    });
  };
  const snackPrice = P => Math.round(Math.max(500, PL.mps(G, P, false).total * 20));
  G.snackPrice = snackPrice;
  const ltdOn = () => G.cfg.ltdEgg.on && (!G.cfg.ltdEgg.ends || G.cfg.ltdEgg.ends > now());
  G.ltdOn = ltdOn;
  function hatch(s, eggId) { // inside a transaction
    const P = s.P, odds = G.cfg.eggs[eggId].odds, keys = Object.keys(odds), w = keys.map(k => +odds[k] || 0);
    const rid = keys[D.pickWeighted(w, rnd)], list = D.speciesFor(rid, null, { secret: true }); if (!list.length) return null;
    const sp = list[(rnd() * list.length) | 0].id, mp = PL.eff(P, 'mutation') ? PL.eff(P, 'mutation').mult : 1;
    const m = D.rollMutations(G.cfg, G.events.effects(), mp, rnd);
    const rat = PL.giveRat(G, P, { sp, mut: m.mut, wx: m.wx, disco: m.disco }, 'egg:' + eggId); if (!rat) return null;
    PL.bump(G, P, 'eggs'); PL.checkAch(G, P);
    G.sendRats(P, [rat]);
    if (RI[SP[sp].r].i >= 8) G.events.announce({ kind: 'rare', text: P.name + ' hatched ' + D.ratName(rat) + ' from a ' + EGG[eggId].n + '!', col: RI[SP[sp].r].col, dur: 8 });
    return rat;
  }
  H.hatch = (s) => send(s, { t: 'err', text: 'Eggs are gone from RAT CATCHERS.' });
  H.hatchOld = (s, m) => { // (eggs were removed)
    const P = s.P, id = String(m.id || ''); if (!EGG[id] || !(P.d.eggs[id] > 0)) return send(s, { t: 'err', text: 'You don’t have that egg.' });
    if (!PL.roomFor(G, P)) return send(s, { t: 'err', text: 'No room for a new rat. Sell or store some first.' });
    G.db.tx(() => { P.d.eggs[id]--; const rat = hatch(s, id); if (!rat) throw new Error('hatch failed'); PL.save(G, P); G.sync(P); send(s, { t: 'bought', kind: 'egg', id, rat: PL.ratView(rat) }); });
  };
  H.box = s => { // open a mystery box
    const P = s.P; if (!(P.d.boxes > 0)) return send(s, { t: 'err', text: 'You have no Mystery Boxes.' });
    const k = D.MYSTERY.table[D.pickWeighted(D.MYSTERY.table.map(x => x[1]), rnd)][0], rw = {};
    if (k === 'money') rw.money = Math.round(Math.max(20000, PL.mps(G, P, false).total * 400));
    if (k === 'potion') rw.potion = D.POTIONS[(rnd() * D.POTIONS.length) | 0].id;
    if (k === 'cosmetic') { const list = D.COSMETICS.filter(c => c.src === 'shop'); rw.cos = list[(rnd() * list.length) | 0].id; }
    if (k === 'rod') { const owned = Math.max(...P.d.rods.map(r => D.ROD[r].i)); const up = D.RODS[Math.min(D.RODS.length - 1, owned + 1 + (rnd() < 0.15 ? 1 : 0))]; if (P.d.rods.includes(up.id)) rw.money = Math.round(Math.max(50000, PL.mps(G, P, false).total * 900)); else rw.rod = up.id; }
    G.db.tx(() => { P.d.boxes--; const got = PL.grant(G, P, rw, null); PL.save(G, P); G.sync(P); send(s, { t: 'boxOpen', k, got }); });
  };
  H.rodEq = (s, m) => { const P = s.P; if (!P.d.rods.includes(m.id)) return; P.d.rod = m.id; P.dirty = true; G.sync(P); petsChanged(s); };
  H.drink = (s, m) => {
    const P = s.P, p = POT[m.id]; if (!p || !(P.d.potions[p.id] > 0)) return send(s, { t: 'err', text: 'You don’t have that potion.' });
    const pc = G.cfg.potions[p.id], cur = PL.eff(P, p.cat), t = now();
    if (cur && cur.mult > pc.mult) return send(s, { t: 'err', text: 'A stronger ' + p.cat + ' potion is already working. Potions of one kind don’t stack.' });
    if (cur && cur.id === p.id) { const left = cur.ends - t; if (left + pc.dur * 1000 > pc.dur * 1000 * G.cfg.potionMax) return send(s, { t: 'err', text: 'That potion is already at its longest time.' }); cur.ends += pc.dur * 1000; }
    else P.d.eff[p.cat] = { id: p.id, mult: pc.mult, ends: t + pc.dur * 1000 };
    P.d.potions[p.id]--; P.dirty = true; G.sync(P); send(s, { t: 'drank', id: p.id });
  };
  H.snack = (s, m) => {
    const P = s.P, r = own(s, m.id); if (!r) return; if (!(P.d.snacks > 0)) return send(s, { t: 'err', text: 'You have no Rat Snacks. Buy some in the shop.' });
    if (r.lvl >= r.cap) return send(s, { t: 'err', text: 'That rat is at its level cap. Raise the cap first.' });
    P.d.snacks--; ratXp(P, r, Math.max(120, D.ratXpNeed(r.lvl) * 0.6)); PL.saveRat(G, P, r); P.dirty = true; G.sendRats(P, [r]);
  };
  H.capUp = (s, m) => {
    const P = s.P, r = own(s, m.id); if (!r) return; if (r.cap >= G.cfg.ratCapMax) return send(s, { t: 'err', text: 'This rat’s level cap is already at the maximum (' + G.cfg.ratCapMax + ').' });
    const price = D.capPrice(r); if (!pay(P, price)) return send(s, { t: 'err', text: 'Raising the cap costs ' + D.fmtMoney(price) + '.' });
    G.db.tx(() => { r.cap = Math.min(G.cfg.ratCapMax, r.cap + G.cfg.ratCapStep); PL.saveRat(G, P, r); PL.save(G, P); }); G.sendRats(P, [r]);
  };

  // ---------- favourites, cosmetics, showcase, evolution ----------
  H.cosEq = (s, m) => {
    const P = s.P, r = own(s, m.id), c = COS[m.cos]; if (!r || !c) return;
    if (!(P.d.cos[c.id] > 0)) return send(s, { t: 'err', text: 'You don’t have a spare ' + c.n + '.' });
    G.db.tx(() => { const prev = r.cos[c.slot]; if (prev) P.d.cos[prev] = (P.d.cos[prev] || 0) + 1; r.cos[c.slot] = c.id; P.d.cos[c.id]--; PL.saveRat(G, P, r); PL.save(G, P); });
    G.sendRats(P, [r]); if (r.place === 'eq') petsChanged(s); if (P.d.showcase.rats.includes(r.id)) sendRoster(s.room);
  };
  H.cosUn = (s, m) => {
    const P = s.P, r = own(s, m.id); if (!r || !r.cos[m.slot]) return;
    G.db.tx(() => { const c = r.cos[m.slot]; P.d.cos[c] = (P.d.cos[c] || 0) + 1; delete r.cos[m.slot]; PL.saveRat(G, P, r); PL.save(G, P); });
    G.sendRats(P, [r]); if (r.place === 'eq') petsChanged(s); if (P.d.showcase.rats.includes(r.id)) sendRoster(s.room);
  };
  H.showcase = (s, m) => {
    const P = s.P, ids = (Array.isArray(m.ids) ? m.ids : []).map(String).filter((id, i, a) => P.rats.has(id) && a.indexOf(id) === i).slice(0, 6);
    const theme = ['classic', 'royal', 'neon', 'nature', 'galaxy', 'candy'].includes(m.theme) ? m.theme : P.d.showcase.theme;
    P.d.showcase = { rats: ids, theme }; P.dirty = true; G.sync(P); if (s.room) sendRoster(s.room);
  };
  H.title = (s, m) => { const P = s.P; if (m.v && !P.d.titles.includes(m.v)) return; P.d.title = m.v || ''; P.dirty = true; G.sync(P); if (s.room) sendRoster(s.room); petsChanged(s); };
  H.color = (s, m) => { if (!/^#[0-9a-f]{6}$/i.test(m.c || '')) return; s.P.color = m.c; s.P.dirty = true; G.sync(s.P); if (s.room) sendRoster(s.room); petsChanged(s); };
  H.evolve = (s, m) => {
    const P = s.P, list = (Array.isArray(m.ids) ? m.ids : []).map(id => own(s, id)).filter(Boolean);
    if (list.length !== 3 || new Set(list).size !== 3) return send(s, { t: 'err', text: 'Pick three rats to combine.' });
    const a = list[0]; if (!list.every(r => r.sp === a.sp && r.evo === a.evo)) return send(s, { t: 'err', text: 'Evolution needs three of the same rat at the same stage.' });
    if (a.evo >= 3) return send(s, { t: 'err', text: 'This rat is fully evolved.' });
    const eaten = list.slice(1);
    if (eaten.some(r => r.lock)) return send(s, { t: 'err', text: 'Locked rats can’t be used for evolution. Unlock them first.' });
    if (list.some(r => busyInTrade(s, r))) return send(s, { t: 'err', text: 'One of those rats is in a trade.' });
    if (eaten.some(r => r.fav) && !m.confirm) return send(s, { t: 'confirm', what: 'evolve', ids: list.map(r => r.id), text: 'Two of these rats will be combined into one. One of them is a favorite. Continue?' });
    const rank = { rainbow: 3, diamond: 2, gold: 1 };
    G.db.tx(() => {
      for (const r of eaten) { if (!a.mut || (rank[r.mut] || 0) > (rank[a.mut] || 0)) a.mut = r.mut || a.mut; if (!a.wx && r.wx) a.wx = r.wx; if (r.disco) a.disco = 1; a.lvl = Math.max(a.lvl, r.lvl); a.cap = Math.max(a.cap, r.cap); PL.removeRat(G, P, r); }
      a.evo++; PL.saveRat(G, P, a); PL.discover(G, P, a); PL.bump(G, P, 'evolved'); PL.checkAch(G, P); PL.save(G, P);
    });
    send(s, { t: 'evolved', rat: PL.ratView(a), gone: eaten.map(r => r.id) }); G.sendRats(P, [a], eaten.map(r => r.id)); if (a.place === 'eq') petsChanged(s);
  };

  // ---------- rewards, quests, rebirth ----------
  H.daily = s => { const r = G.db.tx(() => { const r = PL.claimDaily(G, s.P); PL.save(G, s.P); return r; }); if (!r.ok) send(s, { t: 'err', text: r.why }); else { send(s, Object.assign({ t: 'dailyOk' }, r)); G.sync(s.P); } };
  H.qclaim = (s, m) => { const r = G.db.tx(() => { const r = PL.claimQuest(G, s.P, m.i); PL.save(G, s.P); return r; }); if (!r.ok) send(s, { t: 'err', text: r.why }); G.sync(s.P); };
  H.rebirth = (s, m) => {
    const P = s.P, need = D.rebirthNeed(G.cfg, P.rebirths);
    if (P.level < need) return send(s, { t: 'err', text: 'Reach level ' + need + ' to rebirth.' });
    if (!m.confirm) return;
    G.db.tx(() => {
      P.rebirths++; P.level = 1; P.xp = 0; if (G.cfg.rebirthResetsMoney) P.money = 0;
      const title = 'Reborn' + (P.rebirths > 1 ? ' ' + roman(P.rebirths) : ''); if (!P.d.titles.includes(title)) P.d.titles.push(title); P.d.title = title;
      PL.checkAch(G, P); PL.save(G, P);
    });
    if (s.area && s.area.field) { enterArea(s, 'lobby'); sendRoster(s.room); }
    send(s, { t: 'reborn', n: P.rebirths }); G.sync(P); petsChanged(s);
    G.events.announce({ kind: 'normal', text: P.name + ' was reborn! (Rebirth ' + P.rebirths + ')', col: '#ff9af0', dur: 6, room: s.room ? s.room.code : null });
  };
  const roman = n => { const v = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let s = ''; for (const [k, c] of v) while (n >= k) { s += c; n -= k; } return s; };

  // ---------- information ----------
  H.lb = (s, m) => { const cat = String(m.cat || ''); if (!G.lbCache[cat]) return; send(s, { t: 'lb', cat, l: G.lbCache[cat], at: G.lbAt || 0, me: G.db.rankOf(cat, s.P.id) }); };
  H.insp = (s, m) => {
    const o = [...(s.room ? s.room.players : [])].find(x => x.P.id === (m.id | 0)); if (!o) return send(s, { t: 'err', text: 'That player left the room.' });
    const P = o.P; send(s, { t: 'insp', id: P.id, n: P.name, ti: P.d.title, lvl: P.level, reb: P.rebirths, c: P.color, theme: P.d.showcase.theme, rats: P.d.showcase.rats.map(id => P.rats.get(id)).filter(Boolean).map(r => Object.assign(PL.lookView(r), { id: r.id, earn: D.ratEarn(G.cfg, r, { rebirths: P.rebirths }).total })) });
  };
  H.history = s => send(s, { t: 'history', l: G.db.st.tradesOf.all(s.P.id, s.P.id).map(t => ({ id: t.id, a: t.a, b: t.b, ar: JSON.parse(t.a_rats || '[]'), br: JSON.parse(t.b_rats || '[]'), at: t.at })) });
  H.pw = (s, m) => {
    const acc = G.db.st.accById.get(s.P.id); if (!acc) return;
    if (acc.pass_hash) { const ok = crypto.timingSafeEqual(Buffer.from(passHash(m.old || '', acc.pass_salt), 'hex'), Buffer.from(acc.pass_hash, 'hex')); if (!ok) return send(s, { t: 'err', text: 'Your current password is wrong.' }); }
    if (String(m.pass || '').length < 4) return send(s, { t: 'err', text: 'Passwords need at least 4 characters.' });
    const salt = crypto.randomBytes(16).toString('hex'); G.db.st.accPass.run(passHash(m.pass, salt), salt, s.P.id); s.P.hasPass = true; G.sync(s.P);
    send(s, { t: 'toast', kind: 'ok', text: 'Password saved. You can now log in on other devices.' });
  };
  H.bye = s => { s.ws.close(1000, 'bye'); };

  // ---------- leaderboards (every minute) ----------
  G.lbCache = {}; G.lbAt = 0;
  function computeLb() {
    for (const cat of ['money', 'rarity', 'caught', 'level', 'rebirths', 'mutation', 'trades']) {
      G.lbCache[cat] = G.db.leaderboard(cat, 50).map((r, i) => ({ rank: i + 1, id: r.id, n: r.name, c: r.color || '#ff9f1a', v: cat === 'money' ? r.money : cat === 'rarity' ? r.rarity_score : cat === 'caught' ? r.caught : cat === 'level' ? r.level : cat === 'rebirths' ? r.rebirths : cat === 'mutation' ? r.mutation_score : r.trades, reb: r.rebirths }));
    }
    G.lbAt = now();
  }
  G.computeLb = computeLb;

  // ---------- start ----------
  makeRoom(true, 0, 'Main room');
  computeLb();
  const iv = setInterval(() => { try { tick(); } catch (e) { console.error('tick', e); } }, 100);
  const lbIv = setInterval(() => { try { saveAll(false); computeLb(); } catch (e) { console.error('leaderboards', e); } }, 60000);
  G.stopGame = () => { clearInterval(iv); clearInterval(lbIv); };
  G.dropSession = drop; G.enterArea = enterArea; G.roomInfo = roomInfo; G.ratPos = ratPos; G.pubView = pubView;
}
module.exports = { create };
