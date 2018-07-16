const sql = require('mssql');

const pool = sql.connect(process.env.DB_CONNECTION_STRING);

module.exports = pool;
