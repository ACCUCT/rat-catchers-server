'use strict';
// A small, dependency-free WebSocket server (RFC 6455): text frames, fragmentation, ping/pong, close.
const crypto = require('node:crypto');
const { EventEmitter } = require('node:events');
const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

class Socket extends EventEmitter {
  constructor(sock, req, maxPayload) {
    super();
    this.sock = sock; this.req = req; this.max = maxPayload; this.open = true; this.buf = Buffer.alloc(0); this.frag = null; this.fragOp = 0; this.alive = Date.now();
    this.ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim();
    sock.setNoDelay(true);
    sock.on('data', d => this._data(d));
    sock.on('close', () => this._closed(1006));
    sock.on('error', () => this._closed(1006));
  }
  _data(d) {
    this.alive = Date.now();
    this.buf = this.buf.length ? Buffer.concat([this.buf, d]) : d;
    for (;;) {
      const b = this.buf; if (b.length < 2) return;
      const fin = (b[0] & 0x80) !== 0, op = b[0] & 0x0f, masked = (b[1] & 0x80) !== 0; let len = b[1] & 0x7f, off = 2;
      if (len === 126) { if (b.length < 4) return; len = b.readUInt16BE(2); off = 4; }
      else if (len === 127) { if (b.length < 10) return; const hi = b.readUInt32BE(2), lo = b.readUInt32BE(6); if (hi) return this.close(1009, 'too big'); len = lo; off = 10; }
      if (len > this.max) return this.close(1009, 'too big');
      if (!masked) return this.close(1002, 'unmasked');
      if (b.length < off + 4 + len) return;
      const mask = b.subarray(off, off + 4); off += 4;
      const pl = Buffer.allocUnsafe(len); for (let i = 0; i < len; i++) pl[i] = b[off + i] ^ mask[i & 3];
      this.buf = b.subarray(off + len);
      if (op === 8) { this.close(1000); return; }
      if (op === 9) { this._frame(10, pl); continue; }
      if (op === 10) continue;
      if (op === 1 || op === 2) { if (fin) this._msg(op, pl); else { this.frag = [pl]; this.fragOp = op; } continue; }
      if (op === 0 && this.frag) { this.frag.push(pl); const tot = this.frag.reduce((a, x) => a + x.length, 0); if (tot > this.max) return this.close(1009, 'too big'); if (fin) { const all = Buffer.concat(this.frag); this.frag = null; this._msg(this.fragOp, all); } continue; }
      return this.close(1002, 'bad frame');
    }
  }
  _msg(op, pl) { if (op === 1) this.emit('message', pl.toString('utf8')); }
  _frame(op, pl) {
    if (!this.open) return; const n = pl.length; let h;
    if (n < 126) { h = Buffer.from([0x80 | op, n]); }
    else if (n < 65536) { h = Buffer.alloc(4); h[0] = 0x80 | op; h[1] = 126; h.writeUInt16BE(n, 2); }
    else { h = Buffer.alloc(10); h[0] = 0x80 | op; h[1] = 127; h.writeUInt32BE(0, 2); h.writeUInt32BE(n, 6); }
    try { this.sock.write(Buffer.concat([h, pl])); } catch (e) { this._closed(1006); }
  }
  send(s) { if (this.open) this._frame(1, Buffer.from(typeof s === 'string' ? s : JSON.stringify(s), 'utf8')); }
  get buffered() { return this.sock.writableLength || 0; }
  ping() { this._frame(9, Buffer.alloc(0)); }
  close(code, reason) {
    if (!this.open) return;
    const r = Buffer.from(String(reason || ''), 'utf8').subarray(0, 120), p = Buffer.alloc(2 + r.length); p.writeUInt16BE(code || 1000, 0); r.copy(p, 2);
    this._frame(8, p); this.open = false;
    setTimeout(() => { try { this.sock.end(); this.sock.destroy(); } catch (e) {} }, 100);
    this.emit('close', code || 1000);
  }
  _closed(code) { if (!this.open) return; this.open = false; try { this.sock.destroy(); } catch (e) {} this.emit('close', code); }
}

// Attach to an http server. routes: { '/ws': onConnection(socket), ... }
function attach(server, routes, opts) {
  opts = opts || {}; const all = new Set();
  server.on('upgrade', (req, sock) => {
    const url = new URL(req.url, 'http://x'), fn = routes[url.pathname];
    const key = req.headers['sec-websocket-key'];
    if (!fn || !key || String(req.headers.upgrade || '').toLowerCase() !== 'websocket') { sock.end('HTTP/1.1 400 Bad Request\r\n\r\n'); return; }
    const accept = crypto.createHash('sha1').update(key + GUID).digest('base64');
    sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + accept + '\r\n\r\n');
    const s = new Socket(sock, req, opts.maxPayload || 262144); s.url = url; all.add(s);
    s.on('close', () => all.delete(s));
    try { fn(s); } catch (e) { console.error('ws connection error', e); s.close(1011); }
  });
  // keep connections alive and drop dead ones
  const iv = setInterval(() => { const now = Date.now(); for (const s of all) { if (now - s.alive > 45000) s._closed(1006); else s.ping(); } }, 20000);
  iv.unref && iv.unref();
  return { clients: all };
}
module.exports = { attach };
