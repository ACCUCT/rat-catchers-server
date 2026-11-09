'use strict';
// The owner's control channel (/admin). Logging in needs BOTH the admin password (1111 at first, and it must be
// changed on first login) AND the owner key, a random secret the server writes to data/owner.key on first start.
// The password alone never grants anything. Every action is written to the audit log.
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const D = require('../shared/data.js');
const PL = require('./player.js');

function create(G, dataDir) {
  const keyFile = path.join(dataDir, 'owner.key');
  if (!fs.existsSync(keyFile)) fs.writeFileSync(keyFile, crypto.randomBytes(24).toString('base64url') + '\n', { mode: 0o600 });
  // On a host like Render the key is a long random secret in the host's settings (RC_OWNER_KEY), and the host forgets
  // everything else on restart, so the key alone logs in (a 256-bit secret is safer than any password).
  const keyOnly = (process.env.RC_OWNER_KEY || '').trim().length >= 16;
  const ownerKey = keyOnly ? process.env.RC_OWNER_KEY.trim() : fs.readFileSync(keyFile, 'utf8').trim();
  G.keyOnly = keyOnly;
  let A = G.db.kvGet('admin');
  const ph = (pw, salt) => crypto.scryptSync(String(pw), salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex');
  if (!A) { const salt = crypto.randomBytes(16).toString('hex'); A = { salt, hash: ph('1111', salt), mustChange: true }; G.db.kvSet('admin', A); }
  const fails = new Map(); // ip -> { n, until }
  const sessions = new Map(); // token -> { until }
  const eq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
  const audit = (who, action, detail) => G.db.st.audit.run(Date.now(), who, action, JSON.stringify(detail || {}).slice(0, 2000));
  G.ownerKeyFile = keyFile;

  // a setting must keep the same kind of value as its default (number, yes/no, list or group)
  function badValue(def, v, path) {
    if (def === undefined) return null; // new keys (like a rat's own earnings) are allowed
    if (v === null) return path.startsWith('speciesEarn.') ? null : path;
    if (typeof def === 'number') return typeof v === 'number' && isFinite(v) ? null : path;
    if (typeof def === 'boolean') return typeof v === 'boolean' ? null : path;
    if (typeof def === 'string') return typeof v === 'string' ? null : path;
    if (Array.isArray(def)) { if (!Array.isArray(v)) return path; for (let i = 0; i < v.length; i++) { const b = badValue(def.length ? def[Math.min(i, def.length - 1)] : undefined, v[i], path + '.' + i); if (b) return b; } return null; }
    if (typeof def === 'object') { if (!v || typeof v !== 'object' || Array.isArray(v)) return path; for (const k of Object.keys(v)) { const b = badValue(def[k], v[k], path ? path + '.' + k : k); if (b) return b; } return null; }
    return null;
  }
  function setCfg(patch, who) {
    const bad = badValue(D.DEFAULT_CONFIG, D.deepMerge(D.DEFAULT_CONFIG, D.deepMerge(G.cfgOver || {}, patch)), '');
    if (bad) return 'The value for “' + bad + '” has the wrong type. Nothing was changed.';
    G.cfgOver = D.deepMerge(G.cfgOver || {}, patch); G.db.kvSet('config', G.cfgOver);
    G.cfg = D.deepMerge(D.DEFAULT_CONFIG, G.cfgOver);
    G.broadcast({ t: 'cfg', cfg: G.publicCfg() });
    for (const s of G.sessions) if (s.P) G.sync(s.P);
    audit(who, 'config', patch);
    return null;
  }
  G.setCfg = setCfg;
  function findPlayer(q) {
    const acc = typeof q === 'number' || /^\d+$/.test(String(q)) ? G.db.st.accById.get(+q) : G.db.st.accByName.get(String(q || '').trim());
    if (!acc) return null;
    const sess = G.byPlayer.get(acc.id);
    return { acc, sess, P: sess ? sess.P : PL.load(G, acc) };
  }
  function shutdown(delay, restart, who) {
    const secs = Math.max(5, Math.min(600, delay | 0 || 30));
    G.events.announce({ kind: 'shutdown', text: (restart ? 'The server restarts' : 'The server shuts down') + ' in ' + secs + ' seconds. Your progress is saved.', col: '#ff5c5c', sound: 'alarm', dur: Math.min(30, secs), by: who });
    audit(who, restart ? 'restart' : 'shutdown', { secs });
    setTimeout(() => G.shutdown(restart ? 75 : 0), secs * 1000);
  }

  const C = {}; // admin commands
  C.state = () => ({ t: 'state', keyOnly, over: G.cfgOver || {}, online: [...G.sessions].filter(s => s.P).length, rooms: [...G.rooms.values()].map(r => Object.assign(G.roomInfo(r), { areas: Object.fromEntries(Object.entries(r.areas).filter(([, a]) => a.players.size).map(([k, a]) => [k, a.players.size])) })),
    events: G.events.state(), cfg: G.cfg, defaults: D.DEFAULT_CONFIG, species: D.SPECIES.map(s => ({ id: s.id, n: s.n, r: s.r, earn: D.baseEarn(G.cfg, s.id), own: G.cfg.speciesEarn[s.id] != null, secret: !!s.secret, inv: !!s.inv })),
    ann: G.events.all().slice(-15), audit: G.db.st.auditList.all(40), backups: G.listBackups(), keyFile: G.ownerKeyFile, ver: D.VERSION });
  C.event = (m, who) => { const ok = m.on ? G.events.start(m.id, m.dur | 0, who) : G.events.stop(m.id, who); audit(who, m.on ? 'event start' : 'event stop', m); return { t: 'ok', text: ok ? 'Done.' : 'Unknown event.' }; };
  C.eventDur = (m, who) => { if (!D.EVENTS[m.id]) return { t: 'err', text: 'Unknown event.' }; const e = setCfg({ eventDur: { [m.id]: Math.max(30, Math.min(86400, m.dur | 0)) } }, who); return e ? { t: 'err', text: e } : { t: 'ok', text: 'Event length saved.' }; };
  C.announce = (m, who) => { const a = G.events.announce({ kind: m.kind, text: m.text, col: m.col, sound: m.sound, dur: m.dur, by: who }); audit(who, 'announce', a); return { t: 'ok', text: 'Sent to every room.' }; };
  C.spawn = (m, who) => {
    const sp = D.SP[m.sp]; if (!sp) return { t: 'err', text: 'Unknown rat.' };
    const muts = { mut: ['gold', 'diamond', 'rainbow'].includes(m.mut) ? m.mut : null, wx: ['rain', 'snow', 'thunder'].includes(m.wx) ? m.wx : null, disco: m.disco ? 1 : 0 };
    const n = Math.max(1, Math.min(20, m.n | 0 || 1)); let made = 0;
    for (const room of G.rooms.values()) {
      if (m.room && m.room !== 'all' && room.code !== m.room) continue;
      for (const f of D.FIELDS) {
        if (m.area && m.area !== 'all' && f.id !== m.area) continue;
        const a = room.areas[f.id]; if (!a.players.size && m.area === 'all') continue;
        if (!a.players.size) continue;
        for (let i = 0; i < n; i++) if (G.spawnRat(a, { sp: sp.id, muts })) made++;
      }
    }
    audit(who, 'spawn', Object.assign({}, m, { made }));
    if (made && m.announce !== false) G.events.announce({ kind: 'rare', text: D.aName(D.ratName(Object.assign({ sp: sp.id }, muts))).replace(/^./, c => c.toUpperCase()) + ' appeared! Find it before it escapes.', col: D.RI[sp.r].col, dur: 8, by: who });
    return { t: 'ok', text: made ? 'Spawned ' + made + ' rat' + (made > 1 ? 's' : '') + '.' : 'Nobody is in a matching field right now, so nothing spawned.' };
  };
  C.give = (m, who) => {
    const f = findPlayer(m.player); if (!f) return { t: 'err', text: 'No player called ' + m.player + '.' };
    const P = f.P, rw = {};
    if (m.money) { const v = +m.money; if (!isFinite(v)) return { t: 'err', text: 'Bad amount.' }; G.db.tx(() => { PL.addMoney(G, P, v, false); PL.save(G, P); }); }
    if (m.kind === 'potion' && D.POT[m.id]) { P.d.potions[m.id] = (P.d.potions[m.id] || 0) + Math.max(1, m.n | 0); }
    if (m.kind === 'rod' && D.ROD[m.id] && !P.d.rods.includes(m.id)) P.d.rods.push(m.id);
    if (m.kind === 'cos' && D.COS[m.id]) P.d.cos[m.id] = (P.d.cos[m.id] || 0) + Math.max(1, m.n | 0);
    if (m.kind === 'box') P.d.boxes += Math.max(1, m.n | 0);
    if (m.kind === 'tokens') P.d.tokens += Math.max(1, m.n | 0);
    if (m.kind === 'rat' && D.SP[m.id]) { const r = G.db.tx(() => PL.giveRat(G, P, { sp: m.id, mut: m.mut || null, wx: m.wx || null, disco: m.disco ? 1 : 0 }, 'owner')); if (!r) return { t: 'err', text: P.name + ' has no room for another rat.' }; if (f.sess) G.sendRats(P, [r]); }
    if (m.kind === 'title' && m.id) { const t = String(m.id).slice(0, 30); if (!P.d.titles.includes(t)) P.d.titles.push(t); }
    void rw; P.dirty = true; G.db.tx(() => PL.save(G, P));
    if (f.sess) { G.sync(P); G.toast(P, { kind: 'reward', text: 'A gift from the owner!', sub: [m.money ? D.fmtMoney(+m.money) : '', m.kind ? (m.n > 1 ? m.n + 'x ' : '') + (m.kind === 'rat' ? D.SP[m.id].n : m.id) : ''].filter(Boolean).join(' · ') }); }
    audit(who, 'give', m); return { t: 'ok', text: 'Given to ' + P.name + '.' };
  };
  C.cfg = (m, who) => { if (!m.patch || typeof m.patch !== 'object' || Array.isArray(m.patch)) return { t: 'err', text: 'Nothing to change.' }; const e = setCfg(m.patch, who); return e ? { t: 'err', text: e } : { t: 'ok', text: 'Saved. Every room uses the new settings now.' }; };
  C.cfgReset = (m, who) => { G.cfgOver = {}; G.db.kvSet('config', {}); G.cfg = D.deepMerge(D.DEFAULT_CONFIG, {}); G.broadcast({ t: 'cfg', cfg: G.publicCfg() }); audit(who, 'config reset', {}); return { t: 'ok', text: 'All settings are back to the defaults.' }; };
  C.weather = (m, who) => { G.events.setWeather(m.w, who); audit(who, 'weather', m); return { t: 'ok', text: 'Weather set.' }; };
  C.invasion = (m, who) => { if (m.on) G.events.startInvasion(m.dur | 0, who); else G.events.stopInvasion(who); audit(who, 'invasion', m); return { t: 'ok', text: m.on ? 'The invasion has begun.' : 'Invasion stopped.' }; };
  C.restart = (m, who) => { shutdown(m.delay, true, who); return { t: 'ok', text: 'Restarting soon.' }; };
  C.shutdown = (m, who) => { shutdown(m.delay, false, who); return { t: 'ok', text: 'Shutting down soon.' }; };
  C.backup = (m, who) => { const f = G.db.backup(); audit(who, 'backup', { f }); return { t: 'ok', text: 'Backup saved: ' + path.basename(f) }; };
  C.players = m => { const q = String(m.q || '').replace(/[\\%_]/g, c => '\\' + c); return { t: 'players', l: G.db.st.findPlayers.all('%' + q + '%').map(r => Object.assign(r, { online: G.byPlayer.has(r.id) })) }; };
  C.player = m => { const f = findPlayer(m.id); if (!f) return { t: 'err', text: 'Not found.' }; const P = f.P; return { t: 'player', p: { id: P.id, name: P.name, money: P.money, level: P.level, rebirths: P.rebirths, caught: P.caught, trades: P.trades, rats: P.rats.size, online: !!f.sess, mps: PL.mps(G, P, true).total, banned: !!f.acc.banned } }; };
  C.ban = (m, who) => { const f = findPlayer(m.id); if (!f) return { t: 'err', text: 'Not found.' }; G.db.db.prepare('UPDATE accounts SET banned = ? WHERE id = ?').run(m.v ? 1 : 0, f.acc.id); if (m.v && f.sess) { G.send(f.sess, { t: 'kicked', text: 'You were removed by the server owner.' }); f.sess.ws.close(4001, 'banned'); } audit(who, m.v ? 'ban' : 'unban', { id: f.acc.id, name: f.acc.name }); return { t: 'ok', text: m.v ? 'Banned.' : 'Unbanned.' }; };
  C.setpw = (m, who) => {
    const pw = String(m.pw || ''); if (pw.length < 8 || pw === '1111') return { t: 'err', text: 'Choose a new password with at least 8 characters.' };
    const salt = crypto.randomBytes(16).toString('hex'); A = { salt, hash: ph(pw, salt), mustChange: false }; G.db.kvSet('admin', A); audit(who, 'password changed', {}); return { t: 'ok', text: 'Admin password changed.', pwChanged: true };
  };

  G.onAdmin = ws => {
    let authed = false, who = 'owner@' + ws.ip;
    ws.on('message', raw => {
      let m; try { m = JSON.parse(raw); } catch (e) { return; } if (!m || typeof m.t !== 'string') return;
      const reply = o => ws.send(JSON.stringify(Object.assign({ re: m.rid }, o)));
      if (m.t === 'login') {
        const f = fails.get(ws.ip) || { n: 0, until: 0 };
        if (f.until > Date.now()) return reply({ t: 'loginErr', text: 'Too many wrong tries. Wait ' + Math.ceil((f.until - Date.now()) / 60000) + ' minutes.' });
        const okKey = eq(String(m.key || '').replace(/\s+/g, ''), ownerKey.replace(/\s+/g, '')), okPw = keyOnly || eq(ph(m.pw || '', A.salt), A.hash);
        if (!okKey || !okPw) { f.n++; if (f.n >= 5) { f.until = Date.now() + 15 * 60000; f.n = 0; } fails.set(ws.ip, f); audit('?' + ws.ip, 'failed admin login', { key: okKey, pw: okPw }); return reply({ t: 'loginErr', text: keyOnly ? 'That owner key is wrong. Copy it again from your host’s settings (RC_OWNER_KEY).' + (f.n >= 3 ? ' After 5 wrong tries, logging in is blocked for 15 minutes.' : '') : 'The password or the owner key is wrong.' }); }
        fails.delete(ws.ip); authed = true; const tok = crypto.randomBytes(24).toString('hex'); sessions.set(tok, { until: Date.now() + 12 * 3600e3 });
        audit(who, 'admin login', {}); return reply({ t: 'loginOk', token: tok, mustChange: !keyOnly && !!A.mustChange, keyOnly });
      }
      if (m.t === 'resume') { const se = sessions.get(m.token || ''); if (se && se.until > Date.now()) { authed = true; return reply({ t: 'loginOk', token: m.token, mustChange: !keyOnly && !!A.mustChange, keyOnly }); } return reply({ t: 'loginErr', text: 'Please log in again.' }); }
      if (!authed) return reply({ t: 'loginErr', text: 'Log in first.' });
      if (!keyOnly && A.mustChange && m.t !== 'setpw') return reply({ t: 'err', text: 'Change the starting password (1111) first.', mustChange: true });
      const fn = C[m.t]; if (!fn) return reply({ t: 'err', text: 'Unknown command.' });
      try { reply(fn(m, who)); } catch (e) { console.error('admin', m.t, e); reply({ t: 'err', text: 'That failed: ' + e.message }); }
    });
  };
}
module.exports = { create };
