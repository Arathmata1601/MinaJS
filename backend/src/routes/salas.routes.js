const express = require("express");
const router = express.Router();
const salaController = require("../controllers/salas.controller");
const { authenticateToken, authorizeRole } = require("../middlewares/auth.middlerware");
// Rutas para manejar las salas
router.get("/", authenticateToken, salaController.getAllSalas);
router.post("/", authenticateToken, authorizeRole("admin"), salaController.createSala);
router.get("/:id", authenticateToken, salaController.getSalaById);
router.put("/:id", authenticateToken, authorizeRole("admin"), salaController.updateSala);
router.delete("/:id", authenticateToken, authorizeRole("admin"), salaController.deleteSala);
module.exports = router;
