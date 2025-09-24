const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticateToken, authorizeRole } = require("../middlewares/auth.middlerware");
const { route } = require("./auth.routes");

// GET /api/users - Requiere autenticación
router.get("/", authenticateToken, userController.getAllUsers);

// POST /api/users - Requiere autenticación y rol admin
router.post("/", authenticateToken, authorizeRole(['admin']), userController.createUser);
//router.post("/", userController.createUser);

module.exports = router;
