const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';

const authenticateToken = (req, res, next) => {
  console.log('=== AUTH MIDDLEWARE DEBUG ===');
  console.log('[auth] Ruta:', req.method, req.path);
  console.log('[auth] Headers completos:', JSON.stringify(req.headers, null, 2));
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  console.log('[auth] authHeader:', authHeader);
  console.log('[auth] token extraído:', token);

  if (!token) {
    console.warn('[auth] ❌ TOKEN MISSING - Rechazando petición');
    console.log('============================');
    return res.status(401).json({ 
      error: 'Token de acceso requerido' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.warn('[auth] ❌ TOKEN VERIFICATION FAILED:', err.message);
      console.log('============================');
      return res.status(403).json({ 
        error: 'Token inválido o expirado' 
      });
    }
    console.log('[auth] ✅ TOKEN VÁLIDO - Usuario decodificado:', JSON.stringify(user, null, 2));
    console.log('============================');
    req.user = user;
    next();
  });
};

// Middleware para verificar roles específicos
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado' 
      });
    }

    // Si el usuario no tiene rol, permitir acceso (compatibilidad)
    if (!req.user.rol) {
      console.warn(`[auth] Usuario ${req.user.username} sin rol asignado, permitiendo acceso`);
      return next();
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para acceder a este recurso' 
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
};