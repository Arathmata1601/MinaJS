const { pool } = require("../config/db");
const bcrypt = require('bcrypt');

async function findUserByUsername(username) {
  try {
    console.log('🔍 Ejecutando query para username:', username);
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE username = ?", 
      [username]
    );
    console.log('📊 Query result:', rows.length > 0 ? 'Usuario encontrado' : 'Usuario no encontrado');
    return rows[0];
  } catch (error) {
    console.error('💥 Error en findUserByUsername:', error);
    throw error;
  }
}

async function validatePassword(plainPassword, hashedPassword) {
  try {
    console.log('🔒 Validando contraseña...');
    const result = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('✅ Resultado validación:', result);
    return result;
  } catch (error) {
    console.error('💥 Error en validatePassword:', error);
    throw error;
  }
}

module.exports = {
  findUserByUsername,
  validatePassword
};