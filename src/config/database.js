const mysql = require('mysql2');

const connectDB = () => {
    // First create a connection without specifying database
    const initialConnection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: ''
    });

    // Create database if it doesn't exist
    initialConnection.query('CREATE DATABASE IF NOT EXISTS program_accreditation', (err) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log('Database "program_accreditation" is ready.');
        initialConnection.end();
    });

    // Now connect with the database specified
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'program_accreditation'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return;
        }
        console.log('Connected to the MySQL database.');
    });

    return connection;
};

module.exports = connectDB;