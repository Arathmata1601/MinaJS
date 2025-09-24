const SalaModel = require("../models/salas.model");

exports.getAllSalas = async (req, res) => {
  try {
    const salas = await SalaModel.getAllSalas();
    res.json(salas);
  } catch (error) {
    console.error("Error al obtener las salas:", error);
    res.status(500).json({ error: "Error al obtener las salas" });
  }
};
exports.getSalaById = async (req, res) => {
  try {
    const sala = await SalaModel.getSalaById(req.params.id);    
    if (!sala) {
      return res.status(404).json({ error: "Sala no encontrada" });
    }
    res.json(sala);
  } catch (error) {
    console.error("Error al obtener la sala:", error);
    res.status(500).json({ error: "Error al obtener la sala" });
  }
};
exports.createSala = async (req, res) => {
  try {
    const newSala = await SalaModel.createSala(req.body);
    res.status(201).json(newSala);
  } catch (error) {
    console.error("Error al crear la sala:", error);
    res.status(500).json({ error: "Error al crear la sala" });
  }
};
exports.updateSala = async (req, res) => {
  try {
    const updatedSala = await SalaModel.updateSala(req.params.id, req.body);
    res.json(updatedSala);
  } catch (error) {
    console.error("Error al actualizar la sala:", error);
    res.status(500).json({ error: "Error al actualizar la sala" });
  }
};
exports.deleteSala = async (req, res) => {
  try {
    await SalaModel.deleteSala(req.params.id);
    res.json({ message: "Sala eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la sala:", error);
    res.status(500).json({ error: "Error al eliminar la sala" });
  }
};

