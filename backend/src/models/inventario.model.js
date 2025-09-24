const { pool } = require("../config/db");

async function getAllInventario() {
  const [rows] = await pool.query(`
    SELECT 
      i.id_invent,
      i.id_mineral,
      i.ubicacion,
      i.vitrina,
      i.sala,
      i.estatus as estatus_inventario,
      m.clave_mineral,
      m.nombre_mineral,
      m.descripcion_mineral,
      m.tipo,
      m.estatus as estatus_mineral
    FROM inventario_minerales i
    LEFT JOIN minerales m ON i.id_mineral = m.id_mineral
    ORDER BY i.id_invent DESC
  `);
  return rows;
}

async function getInventarioById(id) {
  const [rows] = await pool.query(`
    SELECT 
      i.id_invent,
      i.id_mineral,
      i.ubicacion,
      i.vitrina,
      i.sala,
      i.estatus as estatus_inventario,
      m.clave_mineral,
      m.nombre_mineral,
      m.descripcion_mineral,
      m.tipo,
      m.estatus as estatus_mineral
    FROM inventario_minerales i
    LEFT JOIN minerales m ON i.id_mineral = m.id_mineral
    WHERE i.id_invent = ?
  `, [id]);
  return rows[0];
}

async function createInventario(inventario) {
  const {
    id_mineral,
    ubicacion,
    vitrina,
    sala,
    estatus
  } = inventario;

  // Verificar que el mineral existe
  const [mineralExists] = await pool.query(
    "SELECT id_mineral FROM minerales WHERE id_mineral = ?", 
    [id_mineral]
  );

  if (!mineralExists.length) {
    throw new Error(`El mineral con ID ${id_mineral} no existe`);
  }

  const [result] = await pool.query(
    `INSERT INTO inventario_minerales (
      id_mineral, ubicacion, vitrina, sala, estatus
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      id_mineral,
      ubicacion || '',
      vitrina || '',
      sala || '',
      estatus || 'Almacen'
    ]
  );

  return {
    id_invent: result.insertId,
    ...inventario
  };
}

async function updateInventario(id, inventario) {
  const {
    id_mineral,
    ubicacion,
    vitrina,
    sala,
    estatus
  } = inventario;

  // Verificar que el registro existe
  const [exists] = await pool.query(
    "SELECT id_invent FROM inventario_minerales WHERE id_invent = ?", 
    [id]
  );

  if (!exists.length) {
    throw new Error(`El registro de inventario con ID ${id} no existe`);
  }

  // Si se va a cambiar el mineral, verificar que existe
  if (id_mineral) {
    const [mineralExists] = await pool.query(
      "SELECT id_mineral FROM minerales WHERE id_mineral = ?", 
      [id_mineral]
    );

    if (!mineralExists.length) {
      throw new Error(`El mineral con ID ${id_mineral} no existe`);
    }
  }

  await pool.query(
    `UPDATE inventario_minerales SET 
      id_mineral = ?, ubicacion = ?, vitrina = ?, 
      sala = ?, estatus = ?
    WHERE id_invent = ?`,
    [
      id_mineral,
      ubicacion,
      vitrina,
      sala,
      estatus,
      id
    ]
  );

  return { id_invent: id, ...inventario };
}

async function deleteInventario(id) {
  // Verificar que el registro existe
  const [exists] = await pool.query(
    "SELECT id_invent FROM inventario_minerales WHERE id_invent = ?", 
    [id]
  );

  if (!exists.length) {
    throw new Error(`El registro de inventario con ID ${id} no existe`);
  }

  await pool.query("DELETE FROM inventario_minerales WHERE id_invent = ?", [id]);
  return { message: "Registro de inventario eliminado correctamente" };
}

// Función para obtener minerales disponibles (que no estén ya en inventario)
async function getMineralesDisponibles() {
  const [rows] = await pool.query(`
    SELECT 
      m.id_mineral,
      m.clave_mineral,
      m.nombre_mineral,
      m.descripcion_mineral,
      m.tipo,
      m.estatus
    FROM minerales m
    LEFT JOIN inventario_minerales i ON m.id_mineral = i.id_mineral
    WHERE i.id_mineral IS NULL
    ORDER BY m.nombre_mineral
  `);
  return rows;
}

// Función para buscar inventario por ubicación o estatus
async function searchInventario(filters) {
  let query = `
    SELECT 
      i.id_invent,
      i.id_mineral,
      i.ubicacion,
      i.vitrina,
      i.sala,
      i.estatus as estatus_inventario,
      m.clave_mineral,
      m.nombre_mineral,
      m.descripcion_mineral,
      m.tipo,
      m.estatus as estatus_mineral
    FROM inventario_minerales i
    LEFT JOIN minerales m ON i.id_mineral = m.id_mineral
    WHERE 1=1
  `;
  
  const params = [];

  if (filters.ubicacion) {
    query += " AND i.ubicacion LIKE ?";
    params.push(`%${filters.ubicacion}%`);
  }

  if (filters.estatus) {
    query += " AND i.estatus = ?";
    params.push(filters.estatus);
  }

  if (filters.sala) {
    query += " AND i.sala = ?";
    params.push(filters.sala);
  }

  if (filters.vitrina) {
    query += " AND i.vitrina = ?";
    params.push(filters.vitrina);
  }

  query += " ORDER BY i.id_invent DESC";

  const [rows] = await pool.query(query, params);
  return rows;
}

module.exports = {
  getAllInventario,
  getInventarioById,
  createInventario,
  updateInventario,
  deleteInventario,
  getMineralesDisponibles,
  searchInventario
};