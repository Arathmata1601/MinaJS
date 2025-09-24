const express = require("express");
const router = express.Router();
const mineralController = require("../controllers/mineral.controller");
const { authenticateToken, authorizeRole } = require("../middlewares/auth.middlerware");

// GET /api/mineral - Todos los minerales
router.get("/", authenticateToken, mineralController.getAllMinerals);

// GET /api/mineral/mineral - Solo tipo "Mineral"
router.get("/mineral", authenticateToken, mineralController.getMineralByMineral);

// GET /api/mineral/fosil - Solo tipo "Fosil"  
router.get("/fosil", authenticateToken, mineralController.getMineralByFosil);

// POST /api/mineral
router.post("/", authenticateToken, authorizeRole("admin"), mineralController.createMineral);

// GET /api/mineral/:id
router.get("/:id", authenticateToken, mineralController.getMineralById);

// PUT /api/mineral/:id
router.put("/:id", authenticateToken, authorizeRole("admin"), mineralController.updateMineral);

// DELETE /api/mineral/:id
router.delete("/:id", authenticateToken, authorizeRole("admin"), mineralController.deleteMineral);

module.exports = router;