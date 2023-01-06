const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// Login route (logout, reset password can be added here)
router.post('/login', authController.login);

module.exports = router;