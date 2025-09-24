const Mineral = require("../models/mineral.model");

exports.getAllMinerals = async (req, res) => {
  try {
    const minerals = await Mineral.getAllMinerals();
    res.json(minerals);
  } catch (err) {
    console.error("Error al obtener minerales:", err);
    res.status(500).json({ error: "Error al obtener minerales" });
  }
};

exports.getMineralByMineral = async (req, res) => {
  try {
    const minerals = await Mineral.getMineralByMineral();
    res.json(minerals);
  } catch (err) {
    console.error("Error al obtener minerales por tipo:", err);
    res.status(500).json({ error: "Error al obtener minerales" });
  }
};

exports.getMineralByFosil = async (req, res) => {
  try {
    const fossils = await Mineral.getMineralByFosil();
    res.json(fossils);
  } catch (err) {
    console.error("Error al obtener fósiles:", err);
    res.status(500).json({ error: "Error al obtener fósiles" });
  }
};

exports.createMineral = async (req, res) => {
  try {
    const newMineral = await Mineral.createMineral(req.body);
    res.status(201).json(newMineral);
  } catch (err) {
    console.error("Error al crear mineral:", err);
    res.status(500).json({ error: "Error al crear mineral", details: err.message });
  }
};

exports.getMineralById = async (req, res) => {
  try {
    const mineral = await Mineral.getMineralById(req.params.id);
    res.json(mineral);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener mineral" });
  }
};
exports.updateMineral = async (req, res) => {
  try {
    const updatedMineral = await Mineral.updateMineral(req.params.id, req.body);
    res.json(updatedMineral);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar mineral" });
  }
};
exports.deleteMineral = async (req, res) => {
  try {
    await Mineral.deleteMineral(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar mineral" });
  }
};
