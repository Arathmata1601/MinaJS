const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/create-test-user - Ruta temporal para crear usuario de prueba
router.post("/create-test-user", async (req, res) => {
  try {
    const bcrypt = require('bcrypt');
    const { pool } = require('../config/db');
    
    const username = 'admin';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      'INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
      [username, hashedPassword, 'admin']
    );
    
    res.json({ message: 'Usuario de prueba creado', username, password });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;