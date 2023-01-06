const connection = require('../database/connection');
const { generateAccessToken } = require('../middleware/auth');
const bcrypt = require('bcrypt');

exports.login = (req, res, next) => {
    try {
        // get the request body and the authorization header
        const { username, password } = req.body;
        
        // validate the request body
        if (!username || !password) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        // get the user from the database
        const query = 'SELECT * FROM users WHERE username = ?';

        connection.query(query, [username], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: 'User does not exist' });
            }

            // compare the hashed password
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                // generate a JSON web token
                const token = generateAccessToken({ userId: result[0].user_id, userName: username });

                res.status(200).json({ message: 'Success', token });
            });
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
