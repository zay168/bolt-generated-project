const initSqlJs = require('sql.js');

let db;

async function initDB() {
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  db = new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);
}

async function insertUser(username, email, password) {
  db.run(`
    INSERT INTO users (username, email, password)
    VALUES (?, ?, ?)
  `, [username, email, password]);
}

async function getUserByUsername(username) {
  const stmt = db.prepare(`
    SELECT * FROM users WHERE username = ?
  `);
  stmt.bind([username]);

  let result = null;
  while (stmt.step()) { //
    result = stmt.getAsObject();
  }
  stmt.free();
  return result;
}

module.exports = {
  initDB,
  insertUser,
  getUserByUsername
};
