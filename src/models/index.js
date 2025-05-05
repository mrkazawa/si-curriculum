class User {
    constructor(connection) {
        this.connection = connection;
    }

    createUser(userData) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO users SET ?';
            this.connection.query(query, userData, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    getUserById(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE id = ?';
            this.connection.query(query, [userId], (error, results) => {
                if (error) return reject(error);
                resolve(results[0]);
            });
        });
    }

    getAllUsers() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users';
            this.connection.query(query, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    updateUser(userId, userData) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET ? WHERE id = ?';
            this.connection.query(query, [userData, userId], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    deleteUser(userId) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM users WHERE id = ?';
            this.connection.query(query, [userId], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = User;