const util = require("util");
const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 20,
  host: "localhost", //"36.93.30.157",
  user: "arcbukubon",
  password: "8Uku.B0n.",
  database: "bbnushal",
  port: "6033",
});

// const pool = mysql.createPool({
//   connectionLimit: 20,
//   host: "localhost",
//   user: "root",
//   password: "wahyu123",
//   database: "nushal",
//   port: "6033",
// });

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  }
  if (connection) connection.release();
});

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query);

module.exports = pool;
