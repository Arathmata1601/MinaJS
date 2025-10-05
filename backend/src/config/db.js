const mysql = require("mysql2/promise");

// Configuración local comentada para uso posterior
/*
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "MinaUser",
  password: process.env.DB_PASS || "95RPR0pfqsG2j8!8",
  database: process.env.DB_NAME || "mina",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
*/

// Configuración de variables de entorno comentada para uso posterior
/*
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
*/

// Configuración para base de datos en la nube (Clever Cloud)

const pool = mysql.createPool({
  host: "b9i0yygjpbierbqjddid-mysql.services.clever-cloud.com",
  user: "ubl0tmomek4dwval",
  password: "x0WpwPlHtRbH3QNfsJIn",
  database: "b9i0yygjpbierbqjddid",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 2,           // Solo 2 conexiones para evitar el límite
  acquireTimeout: 60000,        // 60 segundos para obtener conexión
  timeout: 30000,               // 30 segundos timeout por query (reducido)
  idleTimeout: 300000,          // 5 min - cerrar conexiones inactivas
  maxIdle: 1,                   // Máximo 1 conexión inactiva
  reconnect: true,              // Reconectar automáticamente
  queueLimit: 0
});

// Verificar conexión al inicializar (comentado para evitar usar conexiones)
// pool.getConnection()
//   .then(connection => {
//     console.log('✅ Conexión exitosa a la base de datos');
//     connection.release();
//   })
//   .catch(err => {
//     console.error('❌ Error conectando a la base de datos:', err);
//   });


// Manejar errores del pool
pool.on('connection', (connection) => {
  console.log('Nueva conexión establecida como id ' + connection.threadId);
});

pool.on('error', (err) => {
  console.error('Error en el pool de conexiones:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Reconectando a la base de datos...');
  } else {
    throw err;
  }
});

// Función para cerrar el pool correctamente
const closePool = async () => {
  try {
    await pool.end();
    console.log('Pool de conexiones cerrado correctamente');
  } catch (error) {
    console.error('Error al cerrar el pool:', error);
  }
};

// Función para liberar conexiones inactivas manualmente
const releaseIdleConnections = () => {
  console.log('🔧 Liberando conexiones inactivas...');
  // Esto fuerza al pool a cerrar conexiones que han estado inactivas
  pool._purgeConnection = pool._purgeConnection || function(connection) {
    this._freeConnections = this._freeConnections.filter(conn => conn !== connection);
    connection.destroy();
  };
};

module.exports = { pool, closePool, releaseIdleConnections };
