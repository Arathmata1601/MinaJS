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
  origin: true, // Permitir todos los orígenes temporalmente para debug
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 200
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
