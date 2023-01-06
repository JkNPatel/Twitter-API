const connection = require('../database/connection');
const bcrypt = require('bcrypt');
const { v4 } = require('uuid');

function register(req, res, next) {
    try {
        // get the request body
        const { username, password } = req.body;

        // validate the request body
        if (!username || !password) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        // check if the username is already taken
        const query = 'SELECT * FROM users WHERE username = ?';

        connection.query(query, [username], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (result.length > 0) {
                return res.status(409).json({ message: 'Username already taken' });
            }

            // hash the password using bcrypt
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }

                // create a new user in the database
                const query = 'INSERT INTO users (user_id, username, password, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
                let datetime = new Date();

                connection.query(query, [v4(), username, hash, 'active', datetime, datetime], (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    }
                    res.status(201).json({ message: 'User created' });
                });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { register };