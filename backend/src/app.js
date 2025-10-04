const express = require("express");
const cors = require("cors");
const app = express();

// Middleware de logging para debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  next();
});

// Middlewares
app.use(cors({
  origin: [
    'https://minajs-1.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Manejar peticiones OPTIONS explícitamente (removido porque CORS ya lo maneja automáticamente)
// app.options('*', cors());
// Aumentar límite para cuerpos grandes (por ejemplo subidas multipart y JSON grandes)
const MAX_BODY_SIZE = process.env.MAX_BODY_SIZE || '5gb';
console.log('📦 Configuración de límites de body:', { maxBodySize: MAX_BODY_SIZE });
app.use(express.json({ limit: MAX_BODY_SIZE }));
app.use(express.urlencoded({ extended: true, limit: MAX_BODY_SIZE }));

// Rutas
// const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
// const mineralRoutes = require("./routes/mineral.routes");
// const salaRoutes = require("./routes/salas.routes");
// const inventarioRoutes = require("./routes/inventario.routes");
// const ventasRoutes = require("./routes/ventas.routes");
const importRoutes = require("./routes/import.routes");


// Ruta de prueba para verificar que el API está funcionando
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "API is working", 
    timestamp: new Date().toISOString() 
  });
});

// Comentar temporalmente las rutas para encontrar el problema
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/mineral", mineralRoutes);
// app.use("/api/salas", salaRoutes);
// app.use("/api/inventario", inventarioRoutes);
// app.use("/api/ventas", ventasRoutes);
app.use("/api/import", importRoutes);

// Servir imágenes estáticas (guardadas por el import)
const path = require('path')
app.use('/images/minerales', express.static(path.join(__dirname, '..', 'public', 'images', 'minerales')))

// Manejo de errores generales (incluye PayloadTooLarge)
app.use((err, req, res, next) => {
  console.error('Error middleware caught:', err && err.message ? err.message : err);
  if (!err) return next()

  // Multer file size limit produces a MulterError with code 'LIMIT_FILE_SIZE'
  if (err.code === 'LIMIT_FILE_SIZE' || err.type === 'entity.too.large' || err.status === 413) {
    console.error('📦 Payload too large error:', {
      code: err.code,
      type: err.type,
      status: err.status,
      message: err.message
    });
    return res.status(413).json({ 
      error: 'Archivo demasiado grande. Límite máximo: 500MB. Por favor, use un archivo más pequeño.',
      maxSize: '500MB',
      errorCode: err.code || 'PAYLOAD_TOO_LARGE'
    })
  }

  // Default handler
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Internal server error' })
})

module.exports = app;
