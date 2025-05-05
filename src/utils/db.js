const mysql = require('mysql2');
const { promisify } = require('util');
const config = require('../config/database');

const pool = mysql.createPool(config);

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
    connection.release();
});

const query = promisify(pool.query).bind(pool);

module.exports = {
    query,
};