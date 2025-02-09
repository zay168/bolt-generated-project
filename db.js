let db;

async function initDB(SQL) {
  try {
    const sql = await SQL.default({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });

    // Initialize the database using a worker
    db = await new sql.Database();

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données :", error);
    return false;
  }
}

async function insertUser(username, email, password) {
  try {
    db.run(`
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `, [username, email, password]);
  } catch (error) {
    console.error("Erreur lors de l'insertion de l'utilisateur :", error);
    throw error; // Re-throw the error to be caught in the calling function
  }
}

async function getUserByUsername(username) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM users WHERE username = ?
    `);
    stmt.bind([username]);

    let result = null;
    while (stmt.step()) {
      result = stmt.getAsObject();
    }
    stmt.free();
    return result;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
}

module.exports = {
  initDB,
  insertUser,
  getUserByUsername
};
