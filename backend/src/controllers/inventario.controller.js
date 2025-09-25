const Inventario = require("../models/inventario.model");

exports.getAllInventario = async (req, res) => {
  try {
    const inventario = await Inventario.getAllInventario();
    res.json({
      success: true,
      data: inventario,
      message: "Inventario obtenido correctamente"
    });
  } catch (err) {
    console.error("Error al obtener inventario:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener inventario", 
      details: err.message 
    });
  }
};

exports.getInventarioById = async (req, res) => {
  try {
    const inventario = await Inventario.getInventarioById(req.params.id);
    
    if (!inventario) {
      return res.status(404).json({
        success: false,
        error: "Registro de inventario no encontrado"
      });
    }

    res.json({
      success: true,
      data: inventario,
      message: "Registro de inventario encontrado"
    });
  } catch (err) {
    console.error("Error al obtener registro de inventario:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener registro de inventario", 
      details: err.message 
    });
  }
};

exports.createInventario = async (req, res) => {
  try {
    // Validaciones básicas
    const { id_mineral, ubicacion, vitrina, sala, estatus } = req.body;

    if (!id_mineral) {
      return res.status(400).json({
        success: false,
        error: "El ID del mineral es requerido"
      });
    }

    const newInventario = await Inventario.createInventario(req.body);
    res.status(201).json({
      success: true,
      data: newInventario,
      message: "Registro de inventario creado correctamente"
    });
  } catch (err) {
    console.error("Error al crear registro de inventario:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al crear registro de inventario", 
      details: err.message 
    });
  }
};

exports.updateInventario = async (req, res) => {
  try {
    const updatedInventario = await Inventario.updateInventario(req.params.id, req.body);
    res.json({
      success: true,
      data: updatedInventario,
      message: "Registro de inventario actualizado correctamente"
    });
  } catch (err) {
    console.error("Error al actualizar registro de inventario:", err);
    
    if (err.message.includes("no existe")) {
      return res.status(404).json({
        success: false,
        error: err.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: "Error al actualizar registro de inventario", 
      details: err.message 
    });
  }
};

exports.deleteInventario = async (req, res) => {
  try {
    const result = await Inventario.deleteInventario(req.params.id);
    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    console.error("Error al eliminar registro de inventario:", err);
    
    if (err.message.includes("no existe")) {
      return res.status(404).json({
        success: false,
        error: err.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: "Error al eliminar registro de inventario", 
      details: err.message 
    });
  }
};

exports.getMineralesDisponibles = async (req, res) => {
  try {
    const minerales = await Inventario.getMineralesDisponibles();
    res.json({
      success: true,
      data: minerales,
      message: "Minerales disponibles obtenidos correctamente"
    });
  } catch (err) {
    console.error("Error al obtener minerales disponibles:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener minerales disponibles", 
      details: err.message 
    });
  }
};

exports.searchInventario = async (req, res) => {
  try {
    const filters = req.query; // Obtener filtros de los query parameters
    console.log('🔍 Búsqueda de inventario con filtros:', filters);
    
    const inventario = await Inventario.searchInventario(filters);
    
    console.log('📦 Datos de inventario encontrados:', {
      count: inventario.length,
      firstItem: inventario.length > 0 ? inventario[0] : null,
      sampleData: inventario.slice(0, 2)
    });
    
    res.json({
      success: true,
      data: inventario,
      message: "Búsqueda completada correctamente",
      filters: filters
    });
  } catch (err) {
    console.error("Error al buscar en inventario:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al buscar en inventario", 
      details: err.message 
    });
  }
};