const jwt = require('jsonwebtoken');
const Auth = require('../models/auth.model');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar que se proporcionaron username y password
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username y password son requeridos' 
      });
    }

    // Buscar usuario en la base de datos
    const user = await Auth.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Validar contraseña
    const isValidPassword = await Auth.validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        rol: user.rol 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor'
    });
  }
};