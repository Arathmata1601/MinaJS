const { pool } = require("../config/db");
const bcrypt = require('bcrypt');

async function findUserByUsername(username) {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE username = ?", 
    [username]
  );
  return rows[0];
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  findUserByUsername,
  validatePassword
};