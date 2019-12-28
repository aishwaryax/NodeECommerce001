const mysql = require('mysql2');
const pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'node-e-commerce',
    password: '050899'
});

module.exports = pool.promise();