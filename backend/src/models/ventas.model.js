const { pool } = require("../config/db");

// Obtener todas las ventas con detalles
async function getAllVentas() {
  const [rows] = await pool.query(`
    SELECT 
      v.id_ventas,
      v.subtotal,
      v.iva,
      v.total,
      v.fecha,
      COUNT(vm.id_mineral_venta) as total_minerales
    FROM venta v
    LEFT JOIN venta_minerales vm ON v.id_ventas = vm.id_ventas
    GROUP BY v.id_ventas
    ORDER BY v.fecha DESC
  `);
  return rows;
}

// Obtener venta específica con todos los detalles
async function getVentaById(id) {
  // Obtener datos básicos de la venta
  const [ventaRows] = await pool.query(`
    SELECT 
      v.id_ventas,
      v.subtotal,
      v.iva,
      v.total,
      v.fecha
    FROM venta v
    WHERE v.id_ventas = ?
  `, [id]);

  if (!ventaRows.length) {
    return null;
  }

  const venta = ventaRows[0];

  // Obtener minerales de la venta
  const [mineralesRows] = await pool.query(`
    SELECT 
      mv.id_mineral,
      mv.clave,
      mv.nombre,
      mv.precio,
      mv.descuento,
      (mv.precio - (mv.precio * mv.descuento / 100)) as precio_final
    FROM venta_minerales vm
    JOIN minerales_venta mv ON vm.id_mineral_venta = mv.id_mineral
    WHERE vm.id_ventas = ?
  `, [id]);

  venta.minerales = mineralesRows;
  return venta;
}

// Crear nueva venta
async function createVenta(ventaData) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { subtotal, iva, total, minerales } = ventaData;

    // Insertar la venta principal (sin id_user)
    console.log('[ventas.model] Ejecutando INSERT con datos:', { subtotal, iva, total });
    const [ventaResult] = await connection.query(
      `INSERT INTO venta (subtotal, iva, total, fecha) 
       VALUES (?, ?, ?, NOW())`,
      [subtotal, iva, total]
    );
    console.log('[ventas.model] ✅ INSERT exitoso, ID generado:', ventaResult.insertId);

    const id_ventas = ventaResult.insertId;

    // Insertar los minerales de la venta
    if (minerales && minerales.length > 0) {
      for (const mineralItem of minerales) {
        const { id_mineral_venta } = mineralItem;

        // Verificar que el mineral existe
        console.log('[ventas.model] Verificando mineral con ID:', id_mineral_venta);
        
        try {
          // Intentar con columna cantidad
          const [mineralExists] = await connection.query(
            "SELECT id_mineral, cantidad FROM minerales_venta WHERE id_mineral = ?", 
            [id_mineral_venta]
          );
          console.log('[ventas.model] Resultado búsqueda mineral:', mineralExists);

          if (!mineralExists.length) {
            throw new Error(`El mineral con ID ${id_mineral_venta} no existe en minerales_venta`);
          }

          const mineralData = mineralExists[0];
          if (mineralData.cantidad !== undefined && mineralData.cantidad <= 0) {
            throw new Error(`El mineral con ID ${id_mineral_venta} no tiene cantidad disponible`);
          }

          // Descontar 1 unidad del inventario (solo si existe la columna)
          if (mineralData.cantidad !== undefined) {
            console.log('[ventas.model] Descontando 1 unidad del mineral ID:', id_mineral_venta);
            await connection.query(
              "UPDATE minerales_venta SET cantidad = cantidad - 1 WHERE id_mineral = ?",
              [id_mineral_venta]
            );
          }
        } catch (sqlError) {
          // Si falla por columna cantidad, intentar sin ella
          console.log('[ventas.model] Columna cantidad no existe, verificando solo existencia');
          const [mineralExists] = await connection.query(
            "SELECT id_mineral FROM minerales_venta WHERE id_mineral = ?", 
            [id_mineral_venta]
          );

          if (!mineralExists.length) {
            throw new Error(`El mineral con ID ${id_mineral_venta} no existe en minerales_venta`);
          }
        }

        // Insertar en venta_minerales
        console.log('[ventas.model] Insertando en venta_minerales:', { id_ventas, id_mineral_venta });
        await connection.query(
          "INSERT INTO venta_minerales (id_ventas, id_mineral_venta) VALUES (?, ?)",
          [id_ventas, id_mineral_venta]
        );
        console.log('[ventas.model] ✅ Mineral insertado correctamente');
      }
    }

    await connection.commit();
    
    // Retornar datos básicos de la venta creada
    console.log('[ventas.model] ✅ Venta creada con éxito, ID:', id_ventas);
    return {
      id_ventas,
      subtotal,
      iva,
      total,
      fecha: new Date(),
      message: 'Venta creada correctamente'
    };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Actualizar venta
async function updateVenta(id, ventaData) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Verificar que la venta existe
    const [exists] = await connection.query(
      "SELECT id_ventas FROM venta WHERE id_ventas = ?", 
      [id]
    );

    if (!exists.length) {
      throw new Error(`La venta con ID ${id} no existe`);
    }

    const { subtotal, iva, total, minerales } = ventaData;

    // Actualizar datos básicos de la venta (sin id_user)
    await connection.query(
      `UPDATE venta SET 
        subtotal = ?, iva = ?, total = ?
       WHERE id_ventas = ?`,
      [subtotal, iva, total, id]
    );

    // Si se proporcionan minerales, actualizar la relación
    if (minerales) {
      // Eliminar minerales actuales
      await connection.query(
        "DELETE FROM venta_minerales WHERE id_ventas = ?", 
        [id]
      );

      // Insertar nuevos minerales
      for (const mineralItem of minerales) {
        const { id_mineral_venta } = mineralItem;

        // Verificar que el mineral existe
        const [mineralExists] = await connection.query(
          "SELECT id_mineral FROM minerales_venta WHERE id_mineral = ?", 
          [id_mineral_venta]
        );

        if (!mineralExists.length) {
          throw new Error(`El mineral con ID ${id_mineral_venta} no existe en minerales_venta`);
        }

        await connection.query(
          "INSERT INTO venta_minerales (id_ventas, id_mineral_venta) VALUES (?, ?)",
          [id, id_mineral_venta]
        );
      }
    }

    await connection.commit();
    
    // Obtener la venta actualizada
    const ventaActualizada = await getVentaById(id);
    return ventaActualizada;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Eliminar venta
async function deleteVenta(id) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Verificar que la venta existe
    const [exists] = await connection.query(
      "SELECT id_ventas FROM venta WHERE id_ventas = ?", 
      [id]
    );

    if (!exists.length) {
      throw new Error(`La venta con ID ${id} no existe`);
    }

    // Eliminar relaciones en venta_minerales
    await connection.query("DELETE FROM venta_minerales WHERE id_ventas = ?", [id]);

    // Eliminar la venta principal
    await connection.query("DELETE FROM venta WHERE id_ventas = ?", [id]);

    await connection.commit();
    return { message: "Venta eliminada correctamente" };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Obtener minerales disponibles para venta
async function getMineralesVenta() {
  try {
    // Intentar con columna cantidad primero
    const [rows] = await pool.query(`
      SELECT 
        id_mineral,
        clave,
        nombre,
        precio,
        descuento,
        cantidad,
        (precio - (precio * descuento / 100)) as precio_final
      FROM minerales_venta
      WHERE cantidad > 0
      ORDER BY nombre
    `);
    return rows;
  } catch (error) {
    // Si falla (columna cantidad no existe), usar query sin cantidad
    console.warn('[ventas.model] Columna cantidad no existe, usando query sin cantidad');
    const [rows] = await pool.query(`
      SELECT 
        id_mineral,
        clave,
        nombre,
        precio,
        descuento,
        999 as cantidad,
        (precio - (precio * descuento / 100)) as precio_final
      FROM minerales_venta
      ORDER BY nombre
    `);
    return rows;
  }
}

// Crear/actualizar mineral en minerales_venta
async function createMineralVenta(mineralData) {
  const { clave, nombre, precio, descuento } = mineralData;

  const [result] = await pool.query(
    `INSERT INTO minerales_venta (clave, nombre, precio, descuento) 
     VALUES (?, ?, ?, ?)`,
    [clave, nombre, precio || 0, descuento || 0]
  );

  return {
    id_mineral: result.insertId,
    ...mineralData
  };
}

// Buscar ventas con filtros
async function searchVentas(filters) {
  let query = `
    SELECT 
      v.id_ventas,
      v.subtotal,
      v.iva,
      v.total,
      v.fecha,
      COUNT(vm.id_mineral_venta) as total_minerales
    FROM venta v
    LEFT JOIN venta_minerales vm ON v.id_ventas = vm.id_ventas
    WHERE 1=1
  `;
  
  const params = [];

  if (filters.fecha_inicio && filters.fecha_fin) {
    query += " AND DATE(v.fecha) BETWEEN ? AND ?";
    params.push(filters.fecha_inicio, filters.fecha_fin);
  }

  // Filtro por vendedor eliminado (ya no hay vendedor)

  if (filters.total_min) {
    query += " AND v.total >= ?";
    params.push(filters.total_min);
  }

  if (filters.total_max) {
    query += " AND v.total <= ?";
    params.push(filters.total_max);
  }

  query += " GROUP BY v.id_ventas ORDER BY v.fecha DESC";

  const [rows] = await pool.query(query, params);
  return rows;
}

// Obtener estadísticas de ventas
async function getVentasStats() {
  const [stats] = await pool.query(`
    SELECT 
      COUNT(*) as total_ventas,
      SUM(total) as total_ingresos,
      AVG(total) as promedio_venta,
      MAX(total) as venta_mayor,
      MIN(total) as venta_menor
    FROM venta
  `);

  const [ventasHoy] = await pool.query(`
    SELECT 
      COUNT(*) as ventas_hoy,
      COALESCE(SUM(total), 0) as ingresos_hoy
    FROM venta 
    WHERE DATE(fecha) = CURDATE()
  `);

  const [ventasMes] = await pool.query(`
    SELECT 
      COUNT(*) as ventas_mes,
      COALESCE(SUM(total), 0) as ingresos_mes
    FROM venta 
    WHERE MONTH(fecha) = MONTH(CURDATE()) 
    AND YEAR(fecha) = YEAR(CURDATE())
  `);

  return {
    ...stats[0],
    ...ventasHoy[0],
    ...ventasMes[0]
  };
}

module.exports = {
  getAllVentas,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta,
  getMineralesVenta,
  createMineralVenta,
  searchVentas,
  getVentasStats
};