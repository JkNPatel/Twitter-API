const jwt = require('jsonwebtoken');
require('dotenv').config();

const token_secret = process.env.SECRET_KEY;

function generateAccessToken(user_data) {
    //create a jwt token when login success
    let token = jwt.sign(user_data, token_secret, { expiresIn: '3600s' });
    return token;
}

function authenticateToken(req, res, next) {
  try {
    // Gather the jwt access token from the request header
    if (!req.headers.authorization && req.headers.authorization.indexOf('BASIC ') === -1) {
      return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    const authHeader = req.headers['authorization'] || req.body.auth;
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).json({ message: 'Authentication required' }); // if there isn't any token

    jwt.verify(token, token_secret, (err, decoded) => {
      if (err) return res.status(401).json({ error: err.message });

      req.userId = decoded.userId;
      next() // pass the execution off to whatever request the client intended
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}


module.exports = { generateAccessToken, authenticateToken };