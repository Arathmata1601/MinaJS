const Ventas = require("../models/ventas.model");

exports.getAllVentas = async (req, res) => {
  try {
    const ventas = await Ventas.getAllVentas();
    res.json({
      success: true,
      data: ventas,
      message: "Ventas obtenidas correctamente"
    });
  } catch (err) {
    console.error("Error al obtener ventas:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener ventas", 
      details: err.message 
    });
  }
};

exports.getVentaById = async (req, res) => {
  try {
    const venta = await Ventas.getVentaById(req.params.id);
    
    if (!venta) {
      return res.status(404).json({
        success: false,
        error: "Venta no encontrada"
      });
    }

    res.json({
      success: true,
      data: venta,
      message: "Venta encontrada correctamente"
    });
  } catch (err) {
    console.error("Error al obtener venta:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener venta", 
      details: err.message 
    });
  }
};

exports.createVenta = async (req, res) => {
  try {
    console.log('=== DEBUG CREATE VENTA ===');
    console.log('[ventas] Headers completos:', JSON.stringify(req.headers, null, 2));
    console.log('[ventas] Token extraído:', req.headers.authorization);
    console.log('[ventas] req.user completo:', JSON.stringify(req.user, null, 2));
    console.log('[ventas] Body de la petición:', JSON.stringify(req.body, null, 2));
    console.log('========================');
    // Obtener datos del body
    const { subtotal, iva, total, minerales } = req.body;

    // Validaciones básicas
    if (subtotal === undefined || total === undefined) {
      return res.status(400).json({ success: false, error: 'Los campos subtotal y total son requeridos' });
    }

    if (!minerales || !Array.isArray(minerales) || minerales.length === 0) {
      return res.status(400).json({ success: false, error: 'Debe incluir al menos un mineral en la venta' });
    }

    // Calcular IVA si no se proporciona
    const ivaCalculado = iva !== undefined ? iva : (subtotal * 0.16);
    const totalCalculado = +(subtotal + ivaCalculado).toFixed(2);

    // Verificar que el total coincida (tolerancia 0.01)
    if (Math.abs(totalCalculado - total) > 0.01) {
      return res.status(400).json({ success: false, error: 'El total no coincide con subtotal + IVA' });
    }

    const ventaData = { subtotal, iva: ivaCalculado, total, minerales };

    console.log('[ventas] Llamando a Ventas.createVenta con:', ventaData);
    const nuevaVenta = await Ventas.createVenta(ventaData);
    console.log('[ventas] ✅ Venta creada exitosamente:', nuevaVenta);
    
    const response = { success: true, data: nuevaVenta, message: 'Venta creada correctamente' };
    console.log('[ventas] 📤 Enviando respuesta:', response);
    
    res.status(201).json(response);
  } catch (err) {
    console.error('[ventas] ❌ ERROR AL CREAR VENTA:');
    console.error('[ventas] Error completo:', err);
    console.error('[ventas] Stack trace:', err.stack);
    console.error('[ventas] SQL Error code:', err.code);
    console.error('[ventas] SQL Error message:', err.sqlMessage);
    res.status(500).json({ success: false, error: 'Error al crear venta', details: err.message });
  }
};

exports.updateVenta = async (req, res) => {
  try {
    console.log('[ventas] updateVenta called - headers.Authorization:', (req.headers && req.headers.authorization) ? req.headers.authorization.slice(0,60) + (req.headers.authorization.length>60? '...' : '') : req.headers.authorization);
    console.log('[ventas] updateVenta - req.user:', req.user);
    // Ya no necesitamos validar usuario para las ventas

    const { subtotal, iva, total, minerales } = req.body;

    // Validaciones básicas
    if (subtotal === undefined || total === undefined) {
      return res.status(400).json({ success: false, error: 'Los campos subtotal y total son requeridos' });
    }

    const ventaData = { subtotal, iva: iva || (subtotal * 0.16), total, minerales };

    const ventaActualizada = await Ventas.updateVenta(req.params.id, ventaData);
    res.json({ success: true, data: ventaActualizada, message: 'Venta actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar venta:', err);
    if (err.message.includes('no existe')) {
      return res.status(404).json({ success: false, error: err.message });
    }
    res.status(500).json({ success: false, error: 'Error al actualizar venta', details: err.message });
  }
};

exports.deleteVenta = async (req, res) => {
  try {
    const result = await Ventas.deleteVenta(req.params.id);
    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    console.error("Error al eliminar venta:", err);
    
    if (err.message.includes("no existe")) {
      return res.status(404).json({
        success: false,
        error: err.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: "Error al eliminar venta", 
      details: err.message 
    });
  }
};

exports.getMineralesVenta = async (req, res) => {
  try {
    const minerales = await Ventas.getMineralesVenta();
    res.json({
      success: true,
      data: minerales,
      message: "Minerales para venta obtenidos correctamente"
    });
  } catch (err) {
    console.error("Error al obtener minerales para venta:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener minerales para venta", 
      details: err.message 
    });
  }
};

exports.createMineralVenta = async (req, res) => {
  try {
    const { clave, nombre, precio, descuento } = req.body;

    if (!clave || !nombre || precio === undefined) {
      return res.status(400).json({
        success: false,
        error: "Los campos clave, nombre y precio son requeridos"
      });
    }

    const nuevoMineral = await Ventas.createMineralVenta(req.body);
    res.status(201).json({
      success: true,
      data: nuevoMineral,
      message: "Mineral para venta creado correctamente"
    });
  } catch (err) {
    console.error("Error al crear mineral para venta:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al crear mineral para venta", 
      details: err.message 
    });
  }
};

exports.searchVentas = async (req, res) => {
  try {
    const filters = req.query; // Obtener filtros de los query parameters
    const ventas = await Ventas.searchVentas(filters);
    
    res.json({
      success: true,
      data: ventas,
      message: "Búsqueda de ventas completada correctamente",
      filters: filters
    });
  } catch (err) {
    console.error("Error al buscar ventas:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al buscar ventas", 
      details: err.message 
    });
  }
};

exports.getVentasStats = async (req, res) => {
  try {
    const stats = await Ventas.getVentasStats();
    res.json({
      success: true,
      data: stats,
      message: "Estadísticas de ventas obtenidas correctamente"
    });
  } catch (err) {
    console.error("Error al obtener estadísticas de ventas:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener estadísticas de ventas", 
      details: err.message 
    });
  }
};