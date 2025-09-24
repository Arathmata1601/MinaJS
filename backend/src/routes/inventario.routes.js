const express = require("express");
const router = express.Router();
const inventarioController = require("../controllers/inventario.controller");
const { authenticateToken, authorizeRole } = require("../middlewares/auth.middlerware");

// GET /api/inventario - Obtener todo el inventario
router.get("/", authenticateToken, inventarioController.getAllInventario);

// GET /api/inventario/search - Buscar inventario con filtros
router.get("/search", authenticateToken, inventarioController.searchInventario);

// GET /api/inventario/minerales-disponibles - Obtener minerales disponibles
router.get("/minerales-disponibles", authenticateToken, inventarioController.getMineralesDisponibles);

// GET /api/inventario/:id - Obtener registro específico de inventario
router.get("/:id", authenticateToken, inventarioController.getInventarioById);

// POST /api/inventario - Crear nuevo registro de inventario
router.post("/", authenticateToken, authorizeRole(['admin', 'curator']), inventarioController.createInventario);

// PUT /api/inventario/:id - Actualizar registro de inventario
router.put("/:id", authenticateToken, authorizeRole(['admin', 'curator']), inventarioController.updateInventario);

// DELETE /api/inventario/:id - Eliminar registro de inventario
router.delete("/:id", authenticateToken, authorizeRole(['admin']), inventarioController.deleteInventario);

module.exports = router;