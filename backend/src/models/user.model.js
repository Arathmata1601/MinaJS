const { pool } = require("../config/db");

async function getAllUsers() {
  const [rows] = await pool.query("SELECT * FROM usuarios");
  return rows;
}

const bcrypt = require('bcrypt');

async function createUser(user) {
  const { username, password, rol } = user;
  // Hashear la contraseña antes de guardar
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)",
    [username, hashedPassword, rol]
  );
  return { id: result.insertId, username, rol };
}

module.exports = {
  getAllUsers,
  createUser
};
