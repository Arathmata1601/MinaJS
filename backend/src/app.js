const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5020', 'http://localhost:3000', 'http://127.0.0.1:5173'],
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


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mineral", mineralRoutes);
app.use("/api/salas", salaRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/ventas", ventasRoutes);

module.exports = app;
