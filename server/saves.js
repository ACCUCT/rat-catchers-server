'use strict';
// Device saves: for a free host whose disk is wiped on every restart. Each player's save lives on their own
// device; they bring it when they connect, and the server sends it back every few seconds while they play.
const D = require('../shared/data.js');
const PL_NUM = ['money', 'level', 'xp', 'rebirths', 'caught', 'trades', 'rarity_score', 'mutation_score', 'last_seen'];
const RAT_NUM = ['disco', 'lvl', 'xp', 'cap', 'evo', 'fav', 'lock', 'slot', 'born'];
// check a save that came from a device: right shapes, sane numbers, known rats
function clean(b) {
  if (!b || typeof b !== 'object' || !b.pl || !Array.isArray(b.rats) || b.rats.length > 6000) return null;
  const pl = {}; for (const k of PL_NUM) { const v = Number(b.pl[k]); if (!isFinite(v) || v < 0 || v > 1e300) return null; pl[k] = v; }
  if (typeof b.pl.data !== 'string' || b.pl.data.length > 400000) return null; try { JSON.parse(b.pl.data); } catch (e) { return null; }
  pl.data = b.pl.data; pl.color = /^#[0-9a-fA-F]{6}$/.test(b.pl.color) ? b.pl.color : '#ff9f1a';
  const rats = [], ids = new Set();
  for (const r of b.rats) {
    if (!r || typeof r.id !== 'string' || r.id.length > 24 || ids.has(r.id) || !D.SP[r.sp]) continue;
    const o = { id: r.id, sp: r.sp, mut: typeof r.mut === 'string' ? r.mut.slice(0, 24) : null, wx: typeof r.wx === 'string' ? r.wx.slice(0, 24) : null, place: ['inv', 'sto', 'slot', 'eq'].includes(r.place) ? r.place : 'sto', cos: typeof r.cos === 'string' ? r.cos.slice(0, 2000) : '{}', src: typeof r.src === 'string' ? r.src.slice(0, 40) : '' };
    for (const k of RAT_NUM) { const v = Number(r[k]); o[k] = isFinite(v) ? v : 0; }
    ids.add(r.id); rats.push(o);
  }
  return { name: String(b.name || '').replace(/[^A-Za-z0-9_ ]/g, '').trim().slice(0, 16), pl, rats };
}
function exportAcc(G, id) {
  const st = G.db.st, a = st.accById.get(id), p = st.plGet.get(id); if (!a || !p) return null;
  const pl = {}; for (const k of PL_NUM) pl[k] = p[k]; pl.data = p.data; pl.color = p.color;
  return { name: a.name, pl, rats: st.ratsOf.all(id).map(r => { const o = Object.assign({}, r); delete o.owner; return o; }) };
}
function writeAcc(G, id, b) {
  const st = G.db.st, p = b.pl;
  if (!st.plGet.get(id)) st.plInsert.run(id, p.money, p.data, p.last_seen, p.color);
  st.plSave.run(p.money, p.level, p.xp, p.rebirths, p.caught, p.trades, p.rarity_score, p.mutation_score, p.data, p.last_seen, p.color, id);
  for (const r of st.ratsOf.all(id)) st.ratDelete.run(r.id, id);
  for (const r of b.rats) { if (st.ratGet.get(r.id)) continue; st.ratInsert.run(r.id, id, r.sp, r.mut, r.wx, r.disco, r.lvl, r.xp, r.cap, r.evo, r.fav, r.lock, r.place, r.slot, r.cos, r.born, r.src); } // a rat someone else owns now stays theirs
}
module.exports = { clean, exportAcc, writeAcc };
