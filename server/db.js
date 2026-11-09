'use strict';
// SQLite storage (node:sqlite). Every change that moves money or rats runs inside a transaction.
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

function open(dir) {
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'ratcatchers.db');
  const db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL; PRAGMA busy_timeout=4000;');
  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE COLLATE NOCASE,
      pass_hash TEXT, pass_salt TEXT,
      token_hash TEXT,
      created INTEGER NOT NULL, last_login INTEGER, banned INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY REFERENCES accounts(id),
      money REAL NOT NULL DEFAULT 0, level INTEGER NOT NULL DEFAULT 1, xp REAL NOT NULL DEFAULT 0,
      rebirths INTEGER NOT NULL DEFAULT 0, caught INTEGER NOT NULL DEFAULT 0, trades INTEGER NOT NULL DEFAULT 0,
      rarity_score REAL NOT NULL DEFAULT 0, mutation_score REAL NOT NULL DEFAULT 0,
      data TEXT NOT NULL DEFAULT '{}', last_seen INTEGER NOT NULL DEFAULT 0, color TEXT);
    CREATE TABLE IF NOT EXISTS rats (
      id TEXT PRIMARY KEY, owner INTEGER NOT NULL, sp TEXT NOT NULL,
      mut TEXT, wx TEXT, disco INTEGER NOT NULL DEFAULT 0,
      lvl INTEGER NOT NULL DEFAULT 1, xp REAL NOT NULL DEFAULT 0, cap INTEGER NOT NULL DEFAULT 50, evo INTEGER NOT NULL DEFAULT 0,
      fav INTEGER NOT NULL DEFAULT 0, lock INTEGER NOT NULL DEFAULT 0,
      place TEXT NOT NULL DEFAULT 'inv', slot INTEGER NOT NULL DEFAULT -1,
      cos TEXT NOT NULL DEFAULT '{}', born INTEGER NOT NULL, src TEXT, rev INTEGER NOT NULL DEFAULT 0);
    CREATE INDEX IF NOT EXISTS rats_owner ON rats(owner);
    CREATE TABLE IF NOT EXISTS trades (id INTEGER PRIMARY KEY AUTOINCREMENT, a INTEGER, b INTEGER, a_rats TEXT, b_rats TEXT, at INTEGER);
    CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT);
    CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY AUTOINCREMENT, at INTEGER, who TEXT, action TEXT, detail TEXT);
  `);
  // saves from before the Reverse mutation: add its column
  try { if (!db.prepare('PRAGMA table_info(rats)').all().some(c => c.name === 'rev')) db.exec('ALTER TABLE rats ADD COLUMN rev INTEGER NOT NULL DEFAULT 0'); } catch (e) { console.error('could not add the rev column', e); }
  const st = {
    accByName: db.prepare('SELECT * FROM accounts WHERE name = ?'),
    accById: db.prepare('SELECT * FROM accounts WHERE id = ?'),
    accByToken: db.prepare('SELECT * FROM accounts WHERE token_hash = ?'),
    accInsert: db.prepare('INSERT INTO accounts (name, pass_hash, pass_salt, token_hash, created, last_login) VALUES (?, ?, ?, ?, ?, ?)'),
    accToken: db.prepare('UPDATE accounts SET token_hash = ?, last_login = ? WHERE id = ?'),
    accPass: db.prepare('UPDATE accounts SET pass_hash = ?, pass_salt = ? WHERE id = ?'),
    plInsert: db.prepare('INSERT INTO players (id, money, data, last_seen, color) VALUES (?, ?, ?, ?, ?)'),
    plGet: db.prepare('SELECT * FROM players WHERE id = ?'),
    plSave: db.prepare('UPDATE players SET money = ?, level = ?, xp = ?, rebirths = ?, caught = ?, trades = ?, rarity_score = ?, mutation_score = ?, data = ?, last_seen = ?, color = ? WHERE id = ?'),
    ratsOf: db.prepare('SELECT * FROM rats WHERE owner = ?'),
    ratGet: db.prepare('SELECT * FROM rats WHERE id = ?'),
    ratInsert: db.prepare('INSERT INTO rats (id, owner, sp, mut, wx, disco, lvl, xp, cap, evo, fav, lock, place, slot, cos, born, src, rev) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'),
    ratSave: db.prepare('UPDATE rats SET mut = ?, wx = ?, disco = ?, lvl = ?, xp = ?, cap = ?, evo = ?, fav = ?, lock = ?, place = ?, slot = ?, cos = ?, rev = ? WHERE id = ? AND owner = ?'),
    ratOwner: db.prepare('UPDATE rats SET owner = ?, place = ?, slot = -1, fav = 0 WHERE id = ? AND owner = ? AND lock = 0'),
    ratDelete: db.prepare('DELETE FROM rats WHERE id = ? AND owner = ?'),
    tradeInsert: db.prepare('INSERT INTO trades (a, b, a_rats, b_rats, at) VALUES (?, ?, ?, ?, ?)'),
    tradesOf: db.prepare('SELECT * FROM trades WHERE a = ? OR b = ? ORDER BY id DESC LIMIT 50'),
    kvGet: db.prepare('SELECT value FROM kv WHERE key = ?'),
    kvSet: db.prepare('INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'),
    audit: db.prepare('INSERT INTO audit (at, who, action, detail) VALUES (?, ?, ?, ?)'),
    auditList: db.prepare('SELECT * FROM audit ORDER BY id DESC LIMIT ?'),
    findPlayers: db.prepare("SELECT accounts.id, accounts.name, players.money, players.level, players.rebirths, players.last_seen FROM accounts JOIN players ON players.id = accounts.id WHERE accounts.name LIKE ? ESCAPE '\\' ORDER BY players.last_seen DESC LIMIT 25") };
  let depth = 0;
  function tx(fn) {
    if (depth) return fn(); // already inside a transaction
    db.exec('BEGIN IMMEDIATE'); depth++;
    try { const r = fn(); depth--; db.exec('COMMIT'); return r; }
    catch (e) { depth--; try { db.exec('ROLLBACK'); } catch (er) {} throw e; }
  }
  const kvGet = k => { const r = st.kvGet.get(k); if (!r) return null; try { return JSON.parse(r.value); } catch (e) { return null; } };
  const kvSet = (k, v) => st.kvSet.run(k, JSON.stringify(v));
  function backup(keep) {
    const bdir = path.join(dir, 'backups'); fs.mkdirSync(bdir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
    const out = path.join(bdir, 'ratcatchers-' + stamp + '.db');
    db.exec("VACUUM INTO '" + out.replace(/'/g, "''") + "'");
    const files = fs.readdirSync(bdir).filter(f => /^ratcatchers-.*\.db$/.test(f)).sort();
    while (files.length > (keep || 12)) { try { fs.unlinkSync(path.join(bdir, files.shift())); } catch (e) {} }
    return out;
  }
  function leaderboard(col, limit) {
    const order = { money: 'players.money', caught: 'players.caught', level: 'players.rebirths * 1000 + players.level', rebirths: 'players.rebirths', rarity: 'players.rarity_score', mutation: 'players.mutation_score', trades: 'players.trades' }[col];
    if (!order) return [];
    return db.prepare('SELECT accounts.id, accounts.name, players.color, players.money, players.caught, players.level, players.rebirths, players.rarity_score, players.mutation_score, players.trades FROM players JOIN accounts ON accounts.id = players.id WHERE accounts.banned = 0 ORDER BY ' + order + ' DESC, accounts.id ASC LIMIT ?').all(limit || 50);
  }
  // a player's own place on a leaderboard (from the saved values, like the board itself)
  const ORDER = { money: 'players.money', caught: 'players.caught', level: 'players.rebirths * 1000 + players.level', rebirths: 'players.rebirths', rarity: 'players.rarity_score', mutation: 'players.mutation_score', trades: 'players.trades' };
  const rankSt = {};
  function rankOf(col, id) {
    const order = ORDER[col]; if (!order) return null;
    if (!rankSt[col]) rankSt[col] = { v: db.prepare('SELECT ' + order + ' AS v FROM players WHERE id = ?'), n: db.prepare('SELECT COUNT(*) AS n FROM players JOIN accounts ON accounts.id = players.id WHERE accounts.banned = 0 AND (' + order + ' > ? OR (' + order + ' = ? AND players.id < ?))') };
    const row = rankSt[col].v.get(id); if (!row) return null;
    return { rank: Number(rankSt[col].n.get(row.v, row.v, id).n) + 1, v: row.v };
  }
  return { db, st, tx, kvGet, kvSet, backup, leaderboard, rankOf, file, close: () => db.close() };
}
module.exports = { open };
