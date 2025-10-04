const { pool } = require("../config/db");
const bcrypt = require('bcrypt');

async function findUserByUsername(username) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE username = ?", 
      [username]
    );
    return rows[0];
  } catch (error) {
    console.error('Error en findUserByUsername:', error);
    throw error;
  }
}

async function validatePassword(plainPassword, hashedPassword) {
  try {
    const result = await bcrypt.compare(plainPassword, hashedPassword);
    return result;
  } catch (error) {
    console.error('Error en validatePassword:', error);
    throw error;
  }
}

module.exports = {
  findUserByUsername,
  validatePassword
};