const express = require("express");
const router = express.Router();
const ventasController = require("../controllers/ventas.controller");
const { authenticateToken, authorizeRole } = require("../middlewares/auth.middlerware");

// GET /api/ventas - Obtener todas las ventas
router.get("/", authenticateToken, ventasController.getAllVentas);

// GET /api/ventas/stats - Obtener estadísticas de ventas
router.get("/stats", authenticateToken, authorizeRole(['admin', 'supervisor']), ventasController.getVentasStats);

// GET /api/ventas/search - Buscar ventas con filtros
router.get("/search", authenticateToken, ventasController.searchVentas);

// GET /api/ventas/minerales - Obtener minerales disponibles para venta
router.get("/minerales", authenticateToken, ventasController.getMineralesVenta);

// POST /api/ventas/minerales - Crear nuevo mineral para venta
router.post("/minerales", authenticateToken, authorizeRole(['admin', 'supervisor']), ventasController.createMineralVenta);

// GET /api/ventas/:id - Obtener venta específica
router.get("/:id", authenticateToken, ventasController.getVentaById);

// POST /api/ventas - Crear nueva venta
router.post("/", authenticateToken, ventasController.createVenta);

// PUT /api/ventas/:id - Actualizar venta
router.put("/:id", authenticateToken, authorizeRole(['admin', 'supervisor']), ventasController.updateVenta);

// DELETE /api/ventas/:id - Eliminar venta
router.delete("/:id", authenticateToken, authorizeRole(['admin']), ventasController.deleteVenta);

module.exports = router;