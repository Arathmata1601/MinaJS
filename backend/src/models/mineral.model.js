const { pool } = require("../config/db");

async function getAllMinerals() {
  const [rows] = await pool.query("SELECT * FROM minerales");
  return rows;
}

async function getMineralById(id) {
  const [rows] = await pool.query("SELECT * FROM minerales WHERE id_mineral = ?", [id]);
  return rows[0];
}

async function getMineralByMineral(){
  const [rows] = await pool.query("SELECT * FROM minerales WHERE tipo = 'mineral'");
  return rows;

}

async function getMineralByFosil(){
  const [rows] = await pool.query("SELECT * FROM minerales WHERE tipo = 'Fosil'");
  return rows;
}

async function createMineral(mineral) {
  const { 
    clave_mineral, 
    nombre_mineral, 
    procedencia_mineral, 
    descripcion_mineral, 
    no_caja,
    no_mediana,
      imagen_mineral,
      imagen, 
    fecha, 
    observacion, 
    luminiscencia, 
    talla, 
    medida, 
    tipo, 
    estatus 
  } = mineral;

  const [result] = await pool.query(
    `INSERT INTO minerales (
      clave_mineral, nombre_mineral, procedencia_mineral, descripcion_mineral, 
      no_caja, no_mediana, imagen_mineral, fecha, observacion, 
      luminiscencia, talla, medida, tipo, estatus
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      clave_mineral, 
      nombre_mineral || '', 
      procedencia_mineral || '', 
      descripcion_mineral || '', 
      no_caja || '',
      no_mediana || null,
        imagen_mineral || '',
        imagen || null,
      fecha, 
      observacion || '', 
      luminiscencia || '', 
      talla || '', 
      medida || '', 
      tipo || 'Mineral', 
      estatus || 'Almacen'
    ]
  );
  
  return { 
    id: result.insertId, 
    ...mineral 
  };
}

async function updateMineral(id, mineral) {
  const { 
    clave_mineral, 
    nombre_mineral, 
    procedencia_mineral, 
    descripcion_mineral, 
    no_caja,
    no_mediana,
    imagen_mineral,
    imagen,
    fecha, 
    observacion, 
    luminiscencia, 
    talla, 
    medida, 
    tipo, 
    estatus 
  } = mineral;

  await pool.query(
    `UPDATE minerales SET 
      clave_mineral = ?, nombre_mineral = ?, procedencia_mineral = ?, 
      descripcion_mineral = ?, no_caja = ?, no_mediana = ?, 
      imagen_mineral = ?, fecha = ?, observacion = ?, 
      luminiscencia = ?, talla = ?, medida = ?, tipo = ?, estatus = ? 
    WHERE id_mineral = ?`,
    [
      clave_mineral, 
      nombre_mineral, 
      procedencia_mineral, 
      descripcion_mineral, 
      no_caja,
      no_mediana,
  imagen_mineral,
  imagen,
      fecha, 
      observacion, 
      luminiscencia, 
      talla, 
      medida, 
      tipo, 
      estatus, 
      id
    ]
  );
  
  return { id, ...mineral };
}

async function deleteMineral(id) {
  await pool.query("DELETE FROM minerales WHERE id_mineral = ?", [id]);
  return { message: "Mineral eliminado correctamente" };
}

module.exports = {
  getAllMinerals,
  getMineralById,
  getMineralByMineral,
  getMineralByFosil,
  createMineral,
  updateMineral,
  deleteMineral
};
