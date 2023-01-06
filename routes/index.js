const express = require('express');
const authRoutes = require('./auth');
const tweetsRoutes = require('./tweets');
const usersRoutes = require('./user');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Social Media API');
});

router.use('/auth', authRoutes);
router.use('/tweets', tweetsRoutes);
router.use('/user', usersRoutes);

module.exports = router;

