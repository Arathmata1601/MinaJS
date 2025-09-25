const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://localhost:5020', 
      'http://localhost:3000', 
      'http://127.0.0.1:5173',
      /^https:\/\/.*\.onrender\.com$/,  // Cualquier subdominio de onrender.com
      /^http:\/\/localhost:\d+$/        // Cualquier puerto localhost
    ];
    
    // Verificar si el origin está permitido
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else {
        return allowedOrigin.test(origin);
      }
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Origin no permitido:', origin);
      callback(null, true); // Temporalmente permitir todo para debug
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rutas
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const mineralRoutes = require("./routes/mineral.routes");
const salaRoutes = require("./routes/salas.routes");
const inventarioRoutes = require("./routes/inventario.routes");
const ventasRoutes = require("./routes/ventas.routes");


// Ruta de prueba para verificar que el API está funcionando
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "API is working", 
    timestamp: new Date().toISOString() 
  });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mineral", mineralRoutes);
app.use("/api/salas", salaRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/ventas", ventasRoutes);

module.exports = app;
