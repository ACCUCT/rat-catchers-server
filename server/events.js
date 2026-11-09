'use strict';
// Global events, weather, rat invasions and announcements. One server process runs every room,
// so an event started here reaches every room at once.
const D = require('../shared/data.js');

function create(G) {
  const E = { active: [], weather: null, inv: null, ann: [], nextEvent: 0, nextInv: 0, sig: '' };
  const now = () => Date.now(), rnd = Math.random;
  const live = () => E.active.filter(e => e.ends > now());
  function schedule(t) {
    const c = G.cfg; E.nextEvent = t + 1000 * (c.eventEvery[0] + rnd() * (c.eventEvery[1] - c.eventEvery[0]));
    if (!E.nextInv) E.nextInv = t + 1000 * (c.invasionEvery[0] + rnd() * (c.invasionEvery[1] - c.invasionEvery[0]));
  }
  const durOf = id => (G.cfg.eventDur && G.cfg.eventDur[id]) || D.EVENTS[id].dur;
  const ecfg = id => D.evCfg(G.cfg, id);
  function weather() {
    if (E.weather) return E.weather;
    const ids = live().map(e => e.id);
    if (ids.includes('ultra')) return 'ultra';
    if (ids.includes('thunder')) return 'storm'; if (ids.includes('rain')) return 'rain'; if (ids.includes('snow')) return 'snow';
    return 'clear';
  }
  function state() { return { active: live().map(e => ({ id: e.id, ends: e.ends, by: e.by || '' })), weather: weather(), forced: E.weather || null, inv: E.inv && E.inv.ends > now() ? { ends: E.inv.ends } : null, srv: now() }; }
  function push() { const st = state(); const sig = JSON.stringify([st.active.map(a => a.id + a.ends), st.weather, st.inv && st.inv.ends]); if (sig === E.sig) return; E.sig = sig; G.broadcast(Object.assign({ t: 'events' }, st)); }
  function announce(a) {
    const m = { t: 'ann', kind: a.kind || 'normal', text: String(a.text || '').slice(0, 220), col: a.col || null, sound: a.sound || null, dur: Math.max(2, Math.min(60, +a.dur || 6)), at: now(), by: a.by || '' };
    if (a.room) { const r = G.rooms.get(a.room); if (r) for (const s of r.players) G.send(s, m); return m; }
    E.ann.push(m); if (E.ann.length > 30) E.ann.shift();
    G.broadcast(m); return m;
  }
  function start(id, dur, by) {
    const d = D.EVENTS[id]; if (!d) return false;
    const t = now(), ends = t + 1000 * (dur || durOf(id));
    const ex = E.active.find(e => e.id === id && e.ends > t);
    if (ex) ex.ends = Math.max(ex.ends, ends); else E.active.push({ id, ends, by: by || '' });
    E.active = E.active.filter(e => e.ends > t);
    announce({ kind: 'event', text: d.n + ' has started! ' + D.evDesc(G.cfg, id), col: d.col, dur: 8, sound: id === 'alien' ? 'siren' : null, by });
    if (id === 'alien' || id === 'ultra') E.nextDrop = t + 4000;
    push(); return true;
  }
  function stop(id, by) { const before = E.active.length; E.active = E.active.filter(e => e.id !== id); if (E.active.length !== before) { announce({ kind: 'event', text: D.EVENTS[id].n + ' has ended.', col: D.EVENTS[id].col, dur: 5, by }); push(); } return true; }
  function startInvasion(dur, by) {
    const t = now(); E.inv = { ends: t + 1000 * (dur || G.cfg.invasionDur), by };
    announce({ kind: 'event', text: 'RAT INVASION! Strange rats are pouring into every field. Catch the invaders before they leave!', col: '#ff3a5c', sound: 'siren', dur: 10, by });
    push(); return true;
  }
  function stopInvasion(by) { if (E.inv) { E.inv = null; announce({ kind: 'event', text: 'The rat invasion is over. The invaders have gone home.', col: '#ff3a5c', dur: 6, by }); push(); } return true; }
  function setWeather(w, by) { E.weather = ['clear', 'rain', 'snow', 'storm'].includes(w) ? w : null; push(); return true; }
  function tick(t) {
    let ch = false;
    for (const e of E.active) if (e.ends <= t) { ch = true; announce({ kind: 'event', text: D.EVENTS[e.id].n + ' has ended.', col: D.EVENTS[e.id].col, dur: 5 }); }
    if (ch) E.active = E.active.filter(e => e.ends > t);
    if (E.inv && E.inv.ends <= t) { E.inv = null; ch = true; announce({ kind: 'event', text: 'The rat invasion is over.', col: '#ff3a5c', dur: 6 }); }
    if (!E.nextEvent) schedule(t);
    if (G.cfg.autoEvents && t >= E.nextEvent) {
      const ids = Object.keys(D.EVENTS).filter(k => k !== 'ultra' && ecfg(k).auto !== false), pick = rnd() < 0.06 && ecfg('ultra').auto !== false ? 'ultra' : ids[(rnd() * ids.length) | 0];
      if (G.sessions.size && pick) start(pick, 0, 'auto'); E.nextEvent = 0; schedule(t);
    }
    if (G.cfg.autoInvasions && E.nextInv && t >= E.nextInv) { if (G.sessions.size && !E.inv) startInvasion(0, 'auto'); E.nextInv = t + 1000 * (G.cfg.invasionEvery[0] + rnd() * (G.cfg.invasionEvery[1] - G.cfg.invasionEvery[0])); }
    // Alien Invasion: UFOs beam the event's rats down into fields where people are playing
    const alien = live().find(e => e.id === 'alien');
    if (alien && G.spawnRat) {
      const c = ecfg('alien'), dr = c.drop || D.EVENTS.alien.drop, every = Math.max(5, +dr.every || 25) * 1000;
      if (!E.nextDrop) E.nextDrop = t + 4000;
      if (t >= E.nextDrop) {
        E.nextDrop = t + every;
        const rats = (c.rats && c.rats.length ? c.rats : D.EVENTS.alien.rats).filter(s => D.SP[s]);
        if (rats.length) for (const room of G.rooms.values()) {
          const areas = Object.values(room.areas).filter(a => a.field && a.players.size); if (!areas.length) continue;
          for (let i = 0; i < Math.max(1, Math.min(10, +dr.n || 2)); i++) { const a = areas[(rnd() * areas.length) | 0]; G.spawnRat(a, { sp: rats[(rnd() * rats.length) | 0], ufo: 1 }); }
        }
      }
    } else E.nextDrop = 0;
    if (ch) push();
  }
  function rareSpawn(a, r) { // let players in that field know something special turned up
    const s = D.SP[r.sp], rr = D.RI[s.r];
    const text = r.ev === 3 ? 'A UFO beamed down ' + D.aName(s.n) + '!' : s.evx ? D.aName(s.n).replace(/^./, c => c.toUpperCase()) + ' appeared nearby!' : D.aName(rr.n + ' rat').replace(/^./, c => c.toUpperCase()) + ' appeared nearby!';
    for (const p of a.players) G.send(p, { t: 'toast', kind: 'rare', text, sub: r.ev === 3 ? 'Look for the green beam of light.' : 'Look for the ' + rr.n.toLowerCase() + ' glow.', col: rr.col });
  }
  G.events = { effects: () => D.mergeEvents(live(), G.cfg), active: live, invasion: () => !!(E.inv && E.inv.ends > now()), state, recent: () => E.ann.filter(a => now() - a.at < 60000).slice(-3),
    start, stop, startInvasion, stopInvasion, setWeather, announce, tick, rareSpawn, push, all: () => E.ann.slice() };
}
module.exports = { create };
