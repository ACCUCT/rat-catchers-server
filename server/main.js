#!/usr/bin/env node
'use strict';
/* RAT CATCHERS game server. Plain Node.js 22.13 or newer, no packages to install.
   node server/main.js [--port 8787] [--data ./data] [--no-supervise]
   The main process supervises a worker: it restarts the worker after a crash or when the owner asks for a restart. */
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const { fork } = require('node:child_process');

const args = process.argv.slice(2), arg = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 && args[i + 1] ? args[i + 1] : process.env['RC_' + k.toUpperCase()] || d; };
const PORT = +arg('port', process.env.PORT || 8787), HOST = arg('host', '0.0.0.0'); // hosting services often hand out PORT
const DATA = path.resolve(arg('data', path.join(__dirname, '..', 'data')));
const PUBLIC = path.resolve(arg('public', path.join(__dirname, 'public')));

if (!process.env.RC_WORKER && !args.includes('--no-supervise')) {
  // ---------- supervisor ----------
  let fastFails = 0, lastStart = 0;
  const start = () => {
    lastStart = Date.now();
    const w = fork(__filename, args, { env: Object.assign({}, process.env, { RC_WORKER: '1' }), stdio: 'inherit' });
    w.on('exit', code => {
      if (code === 0) { console.log('RAT CATCHERS server stopped.'); process.exit(0); }
      if (Date.now() - lastStart < 15000) fastFails++; else fastFails = 0;
      if (fastFails > 5) { console.error('The server keeps crashing on start. Stopping. Check the messages above.'); process.exit(1); }
      console.log(code === 75 ? 'Restarting the server...' : 'The server stopped unexpectedly (code ' + code + '). Restarting in 2 seconds...');
      setTimeout(start, code === 75 ? 300 : 2000);
    });
    const stop = () => { w.kill('SIGTERM'); };
    process.once('SIGINT', stop); process.once('SIGTERM', stop);
  };
  start();
  return;
}

// ---------- worker ----------
process.removeAllListeners('warning'); process.on('warning', w => { if (w.name !== 'ExperimentalWarning') console.warn(w); });
const D = require('../shared/data.js');
const DB = require('./db.js');
const WS = require('./ws.js');
const G = { D };
// device saves: for free hosts that wipe their disk on restart (players keep their own saves)
G.devSaves = process.env.RC_DEVICE_SAVES === '1' || args.includes('--device-saves');
G.db = DB.open(DATA);
G.cfgOver = G.db.kvGet('config') || {};
G.cfg = D.deepMerge(D.DEFAULT_CONFIG, G.cfgOver);
G.publicCfg = () => G.cfg;
G.listBackups = () => { try { return fs.readdirSync(path.join(DATA, 'backups')).filter(f => f.endsWith('.db')).sort().slice(-12); } catch (e) { return []; } };
require('./events.js').create(G);
require('./game.js').create(G);
require('./trade.js').create(G);
require('./admin.js').create(G, DATA);

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/status') { res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); res.end(JSON.stringify({ ok: true, game: 'RAT CATCHERS', players: [...G.sessions].filter(s => s.P).length, rooms: G.rooms.size, events: G.events.state().active.map(e => e.id) })); return; }
  let p; try { p = decodeURIComponent(url.pathname); } catch (e) { res.writeHead(400); res.end(); return; }
  if (p === '/') p = '/index.html'; if (p === '/admin' || p === '/admin/') p = '/admin.html';
  const file = path.join(PUBLIC, path.normalize(p).replace(/^([/\\])+/, ''));
  if (!file.startsWith(PUBLIC + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return; }
    if (G.keyOnly && path.basename(file) === 'admin.html') buf = Buffer.from(String(buf).replace('<head>', '<head><script>window.RC_KEYONLY = 1;</script>'));
    if (G.devSaves && path.basename(file) === 'index.html') buf = Buffer.from(String(buf).replace('window.RC_SERVER = location.host;', "window.RC_HOSTED = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws';"));
    const h = { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
    if (path.basename(file) === 'admin.html') { h['X-Frame-Options'] = 'DENY'; h['Content-Security-Policy'] = "frame-ancestors 'none'"; }
    res.writeHead(200, h);
    res.end(buf);
  });
});
WS.attach(server, { '/ws': ws => G.onConnection(ws), '/admin': ws => G.onAdmin(ws) }, { maxPayload: 262144 });

let stopping = false;
G.shutdown = code => {
  if (stopping) return; stopping = true;
  try { G.saveAll(true); } catch (e) { console.error('final save failed', e); }
  for (const s of G.sessions) { try { G.send(s, { t: 'kicked', text: code === 75 ? 'The server is restarting. Reconnecting…' : 'The server has shut down.', restart: code === 75 }); s.ws.close(code === 75 ? 4075 : 4001, 'server stop'); } catch (e) {} }
  G.stopGame();
  setTimeout(() => { try { G.db.backup(); } catch (e) {} try { G.db.close(); } catch (e) {} process.exit(code || 0); }, 400);
};
process.on('SIGTERM', () => G.shutdown(0)); process.on('SIGINT', () => G.shutdown(0));
process.on('uncaughtException', e => { console.error('Uncaught error:', e); try { G.saveAll(true); } catch (er) {} process.exit(1); });
// a backup every 6 hours
setInterval(() => { try { const f = G.db.backup(); console.log('Backup saved:', path.basename(f)); } catch (e) { console.error('backup failed', e); } }, 6 * 3600e3).unref();

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('  RAT CATCHERS server is running on port ' + PORT + '.');
  console.log('  Play:        http://localhost:' + PORT + '/');
  console.log('  Owner app:   http://localhost:' + PORT + '/admin');
  console.log('  Saves:       ' + G.db.file);
  console.log(process.env.RC_OWNER_KEY ? '  Owner key:   set by RC_OWNER_KEY (see your host\'s environment settings)' : '  Owner key:   ' + fs.readFileSync(G.ownerKeyFile, 'utf8').trim() + '   (also in ' + G.ownerKeyFile + ')');
  if (G.devSaves) console.log('  Saves:       kept on each player\'s device (device saves mode)');
  console.log('');
});
