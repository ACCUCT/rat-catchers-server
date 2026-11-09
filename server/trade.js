'use strict';
// Trading between two players in the same room. Both sides add rats, both press Ready, both confirm,
// a 5 second countdown runs, and then the server moves the rats in one database transaction.
const D = require('../shared/data.js');
const PL = require('./player.js');
const MAX_RATS = 9, COUNTDOWN = 5000;

function create(G) {
  const trades = new Map(); // session -> trade
  const asks = new Map();   // target player id -> { from session, at }
  let seq = 0;
  const now = () => Date.now();
  const side = (T, s) => T.a === s ? 'a' : 'b', other = (T, s) => T.a === s ? T.b : T.a;
  function tview(T, s) {
    const me = side(T, s), them = me === 'a' ? 'b' : 'a', ratsOf = (sess, ids) => ids.map(id => sess.P.rats.get(id)).filter(Boolean).map(r => Object.assign(PL.ratView(r), { earn: D.ratEarn(G.cfg, r, { rebirths: sess.P.rebirths }).total }));
    return { t: 'trade', id: T.id, with: { id: other(T, s).P.id, n: other(T, s).P.name }, mine: ratsOf(s, T.off[me]), theirs: ratsOf(other(T, s), T.off[them]), ready: { me: T.ready[me], them: T.ready[them] }, conf: { me: T.conf[me], them: T.conf[them] }, ends: T.ends || 0, srv: now() };
  }
  const update = T => { G.send(T.a, tview(T, T.a)); G.send(T.b, tview(T, T.b)); };
  function reset(T) { T.ready = { a: 0, b: 0 }; T.conf = { a: 0, b: 0 }; T.ends = 0; if (T.timer) { clearTimeout(T.timer); T.timer = null; } }
  function cancel(T, why) {
    if (T.done) return; T.done = true; if (T.timer) clearTimeout(T.timer);
    trades.delete(T.a); trades.delete(T.b);
    for (const s of [T.a, T.b]) G.send(s, { t: 'tradeEnd', ok: false, why: why || 'The trade was cancelled.' });
  }
  function cancelFor(s, why) { const T = trades.get(s); if (T) cancel(T, (s.P ? s.P.name : 'The other player') + ' ' + (why || 'left') + '. Trade cancelled.'); asks.delete(s.P && s.P.id); }
  const holds = (s, id) => { const T = trades.get(s); return !!(T && T.off[side(T, s)].includes(id)); };
  const H = {};
  H.tReq = (s, m) => {
    const o = s.room && [...s.room.players].find(x => x.P.id === (m.to | 0));
    if (!o || o === s) return G.send(s, { t: 'err', text: 'That player isn’t in your room.' });
    if (trades.get(s)) return G.send(s, { t: 'err', text: 'Finish your current trade first.' });
    if (trades.get(o)) return G.send(s, { t: 'err', text: o.P.name + ' is already trading.' });
    asks.set(o.P.id, { from: s, at: now() });
    G.send(o, { t: 'tAsk', from: s.P.id, n: s.P.name }); G.send(s, { t: 'toast', kind: 'trade', text: 'Trade request sent to ' + o.P.name + '.' });
  };
  H.tAns = (s, m) => {
    const q = asks.get(s.P.id); asks.delete(s.P.id);
    if (!q || q.from.P == null || q.from.P.id !== (m.from | 0) || now() - q.at > 60000) return G.send(s, { t: 'err', text: 'That trade request expired.' });
    const o = q.from; if (!m.ok) return G.send(o, { t: 'toast', kind: 'trade', text: s.P.name + ' said no to trading.' });
    if (o.room !== s.room) return G.send(s, { t: 'err', text: o.P.name + ' left the room.' });
    if (trades.get(s) || trades.get(o)) return G.send(s, { t: 'err', text: 'One of you is already trading.' });
    const T = { id: ++seq, a: o, b: s, off: { a: [], b: [] }, ready: { a: 0, b: 0 }, conf: { a: 0, b: 0 }, ends: 0, timer: null, done: false };
    trades.set(o, T); trades.set(s, T); update(T);
  };
  H.tAdd = (s, m) => {
    const T = trades.get(s); if (!T || T.ends) return; const me = side(T, s), r = s.P.rats.get(String(m.id || ''));
    if (!r) return; if (T.off[me].includes(r.id)) return;
    if (r.lock) return G.send(s, { t: 'err', text: 'Locked rats can’t be traded. Unlock it first.' });
    if (r.place === 'slot' || r.place === 'eq') return G.send(s, { t: 'err', text: 'Take that rat out of its ' + (r.place === 'slot' ? 'money slot' : 'equipped spot') + ' first.' });
    if (T.off[me].length >= MAX_RATS) return G.send(s, { t: 'err', text: 'You can offer up to ' + MAX_RATS + ' rats in one trade.' });
    if (r.fav && !m.confirm) return G.send(s, { t: 'confirm', what: 'tradefav', id: r.id, text: D.ratName(r) + ' is one of your favorites. Offer it in this trade?' });
    T.off[me].push(r.id); reset(T); update(T);
  };
  H.tRem = (s, m) => { const T = trades.get(s); if (!T || T.ends) return; const me = side(T, s); T.off[me] = T.off[me].filter(id => id !== String(m.id)); reset(T); update(T); };
  H.tReady = (s, m) => { const T = trades.get(s); if (!T) return; const me = side(T, s); if (T.ends && !m.v) { reset(T); update(T); return; } T.ready[me] = m.v ? 1 : 0; if (!T.ready[me]) T.conf = { a: 0, b: 0 }; update(T); };
  H.tConfirm = s => {
    const T = trades.get(s); if (!T || !T.ready.a || !T.ready.b || T.ends) return; const me = side(T, s);
    if (!T.off.a.length && !T.off.b.length) return G.send(s, { t: 'err', text: 'Add at least one rat first.' });
    T.conf[me] = 1;
    if (T.conf.a && T.conf.b) { T.ends = now() + COUNTDOWN; T.timer = setTimeout(() => commit(T), COUNTDOWN); }
    update(T);
  };
  H.tCancel = s => { const T = trades.get(s); if (T) cancel(T, s.P.name + ' cancelled the trade.'); };
  function commit(T) {
    T.timer = null; if (T.done) return;
    const A = T.a.P, B = T.b.P;
    if (!A || !B || !T.a.ws.open || !T.b.ws.open) return cancel(T, 'Someone disconnected. Trade cancelled.');
    let res;
    try {
      res = G.db.tx(() => {
        const ra = T.off.a.map(id => A.rats.get(id)), rb = T.off.b.map(id => B.rats.get(id));
        if (ra.some(r => !r || r.lock || r.place === 'slot' || r.place === 'eq') || rb.some(r => !r || r.lock || r.place === 'slot' || r.place === 'eq')) throw new Error('changed');
        const free = (P, out, inc) => { const c = PL.cap(G, P); return (c.inv - PL.countPlace(P, 'inv')) + (c.storage - PL.countPlace(P, 'sto')) + out - inc; };
        if (free(A, ra.length, rb.length) < 0) throw new Error('full:' + A.name);
        if (free(B, rb.length, ra.length) < 0) throw new Error('full:' + B.name);
        const move = (from, to, r) => {
          from.rats.delete(r.id); from.d.showcase.rats = from.d.showcase.rats.filter(x => x !== r.id);
          const place = PL.countPlace(to, 'inv') < PL.cap(G, to).inv ? 'inv' : 'sto';
          const ch = G.db.st.ratOwner.run(to.id, place, r.id, from.id); if (!ch.changes) throw new Error('changed');
          r.place = place; r.slot = -1; r.fav = 0; to.rats.set(r.id, r); PL.discover(G, to, r);
        };
        for (const r of ra) move(A, B, r); for (const r of rb) move(B, A, r);
        A.trades++; B.trades++; PL.bump(G, A, 'trades'); PL.bump(G, B, 'trades');
        G.db.st.tradeInsert.run(A.id, B.id, JSON.stringify(ra.map(r => ({ id: r.id, sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco, rev: r.rev || 0, lvl: r.lvl, evo: r.evo }))), JSON.stringify(rb.map(r => ({ id: r.id, sp: r.sp, mut: r.mut, wx: r.wx, disco: r.disco, rev: r.rev || 0, lvl: r.lvl, evo: r.evo }))), now());
        PL.checkAch(G, A); PL.checkAch(G, B); PL.save(G, A); PL.save(G, B);
        return { ra, rb };
      });
    } catch (e) {
      const msg = String(e.message || ''); return cancel(T, msg.startsWith('full:') ? msg.slice(5) + ' has no room for the new rats. Trade cancelled.' : 'Something changed during the countdown. Trade cancelled.');
    }
    T.done = true; trades.delete(T.a); trades.delete(T.b);
    G.send(T.a, { t: 'tradeEnd', ok: true, got: res.rb.map(PL.ratView), gave: res.ra.map(r => r.id) });
    G.send(T.b, { t: 'tradeEnd', ok: true, got: res.ra.map(PL.ratView), gave: res.rb.map(r => r.id) });
    G.sendRats(A, res.rb, res.ra.map(r => r.id)); G.sendRats(B, res.ra, res.rb.map(r => r.id));
    if (T.a.room) G.sendRoster(T.a.room);
  }
  G.trade = { H, cancelFor, holds, active: () => trades.size / 2 };
}
module.exports = { create };
