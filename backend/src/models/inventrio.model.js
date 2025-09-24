const {poll} = require("../config/db");

async function getAllInventarioMinerales() {
  const [rows] = await pool.query("SELECT * FROM inventario_minerales");
  return rows;
}

module.exports = {
  getAllInventarioMinerales
};
