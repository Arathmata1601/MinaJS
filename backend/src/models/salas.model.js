const {pool} = require("../config/db");

async function getAllSalas() {
  const [rows] = await pool.query("SELECT * FROM salas");
  return rows;
}
async function getSalaById(id) {
  const [rows] = await pool.query("SELECT * FROM salas WHERE id_sala = ?", [id]);
  return rows[0];
}
async function createSala(sala) {
  const { num_vitrinas} = sala;
  const [result] = await pool.query("INSERT INTO salas (num_vitrinas) VALUES (?)", [num_vitrinas]);
  return { id: result.insertId, ...sala };
}

async function updateSala(id, sala) {
  const { num_vitrinas} = sala;
  await pool.query("UPDATE salas SET num_vitrinas = ? WHERE id_sala = ?", [num_vitrinas, id]);
  return { id, ...sala };
}
async function deleteSala(id) {
  await pool.query("DELETE FROM salas WHERE id_sala = ?", [id]);
  return { message: "Sala eliminada correctamente" };
}
module.exports = {
  getAllSalas,
  getSalaById,
  createSala,
  updateSala,
  deleteSala
};