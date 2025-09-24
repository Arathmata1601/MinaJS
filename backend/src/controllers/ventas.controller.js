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
    // Validaciones básicas
    const { subtotal, iva, total, id_user, minerales } = req.body;

    if (!subtotal || !total || !id_user) {
      return res.status(400).json({
        success: false,
        error: "Los campos subtotal, total e id_user son requeridos"
      });
    }

    if (!minerales || !Array.isArray(minerales) || minerales.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Debe incluir al menos un mineral en la venta"
      });
    }

    // Calcular IVA si no se proporciona
    const ivaCalculado = iva || (subtotal * 0.16);
    const totalCalculado = subtotal + ivaCalculado;

    // Verificar que el total coincida
    if (Math.abs(totalCalculado - total) > 0.01) {
      return res.status(400).json({
        success: false,
        error: "El total no coincide con subtotal + IVA"
      });
    }

    const ventaData = {
      subtotal,
      iva: ivaCalculado,
      total,
      id_user,
      minerales
    };

    const nuevaVenta = await Ventas.createVenta(ventaData);
    res.status(201).json({
      success: true,
      data: nuevaVenta,
      message: "Venta creada correctamente"
    });
  } catch (err) {
    console.error("Error al crear venta:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al crear venta", 
      details: err.message 
    });
  }
};

exports.updateVenta = async (req, res) => {
  try {
    const { subtotal, iva, total, id_user, minerales } = req.body;

    // Validaciones básicas
    if (!subtotal || !total || !id_user) {
      return res.status(400).json({
        success: false,
        error: "Los campos subtotal, total e id_user son requeridos"
      });
    }

    const ventaData = {
      subtotal,
      iva: iva || (subtotal * 0.16),
      total,
      id_user,
      minerales
    };

    const ventaActualizada = await Ventas.updateVenta(req.params.id, ventaData);
    res.json({
      success: true,
      data: ventaActualizada,
      message: "Venta actualizada correctamente"
    });
  } catch (err) {
    console.error("Error al actualizar venta:", err);
    
    if (err.message.includes("no existe")) {
      return res.status(404).json({
        success: false,
        error: err.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: "Error al actualizar venta", 
      details: err.message 
    });
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