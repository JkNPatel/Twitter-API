const express = require('express');
const router = express.Router();

const { authenticateToken }  = require('../middleware/auth');
const tweetController = require('../controllers/tweetController');


// get all tweets for authenticated user
router.get('/', authenticateToken, tweetController.getTweets);

// get single tweet details using id for authenticated user
router.get('/:id', authenticateToken, tweetController.getTweetDetails);

// add tweet for authenticated user
router.post('/', authenticateToken, tweetController.createTweet);

// update tweet for authenticated user
router.patch('/:id', authenticateToken, tweetController.updateTweet);

// add tweet for authenticated user
router.delete('/:id', authenticateToken, tweetController.deleteTweet);

// like/unlike a tweet
router.patch('/:id/like', authenticateToken, tweetController.likeTweet);

// retweet a tweet
router.post('/:id/retweet', authenticateToken, tweetController.retweet);

// create a thread (a tweet in reply to another tweet)
router.post('/:id/thread', authenticateToken, tweetController.createThread);

module.exports = router;