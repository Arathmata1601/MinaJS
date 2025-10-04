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
  connectionLimit: 10,
  queueLimit: 0
});


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

module.exports = { pool, closePool };
