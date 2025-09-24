const app = require("./src/app");
const { closePool } = require("./src/config/db");
const PORT = process.env.PORT || 5020;

// Configurar límite de listeners para evitar warnings
process.setMaxListeners(0);

// Función para cerrar recursos correctamente
const gracefulShutdown = async () => {
  console.log('Cerrando servidor y recursos...');
  
  server.close(async () => {
    console.log('Servidor HTTP cerrado');
    
    // Cerrar conexiones de base de datos
    await closePool();
    
    console.log('Aplicación terminada correctamente');
    process.exit(0);
  });
};

// Manejar señales de terminación
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
  gracefulShutdown();
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
