const connection = require('../database/connection');
const { v4 } = require('uuid');

function getTweets(req, res, next) {
    const query = 'SELECT * FROM tweets WHERE user_id = ?';
    connection.query(query, [req.userId], (error, results) => {
        if (error) {
            return res.status(500).send({ error: 'Error reading tweets' });
        }
        res.send(results);
    });
}

function getTweetDetails(req, res, next) {
    try {
        connection.query('SELECT * FROM tweets WHERE tweet_id = ? AND user_id = ?', [req.params.id, req.userId], (error, results) => {
            if (error) {
                return res.status(500).send({ error: 'Error reading tweet' });
            }
            if (!results.length) {
                return res.status(404).send({ error: 'Tweet not found' });
            }
            res.send(results[0]);
        });
    } catch (error) {

    }
}

function createTweet(req, res, next) {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).send({ error: 'Title and description are required' });
        }

        let datetime = new Date();
        let params = { tweet_id: v4(), title: title, description: description, user_id: req.userId, created_at: datetime, updated_at: datetime };
        const query = 'INSERT INTO tweets SET ?';

        connection.query(query, params, (error, results) => {
            if (error) {
                console.log(error)
                return res.status(500).send({ error: 'Error creating tweet' });
            }
            res.status(201).send({ message: 'Tweet created successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

function updateTweet(req, res, next) {
    try {
        const { title, description } = req.body;
        let dataToUpdate = { updated_at: new Date() };

        if (!title || !description) {
            return res.status(400).send({ error: 'Title or description are required' });
        }

        // setting data to update if provided
        title ? dataToUpdate.title = title : '';
        description ? dataToUpdate.description = description : '';

        connection.query('UPDATE tweets SET ? WHERE tweet_id = ? AND user_id = ?', [dataToUpdate, req.params.id, req.userId], (error, results) => {
            if (error) {
                return res.status(500).send({ error: 'Error updating tweet' });
            }
            if (!results.affectedRows) {
                return res.status(404).send({ error: 'Tweet not found' });
            }
            res.send({ message: 'Tweet updated successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

function deleteTweet(req, res, next) {
    try {
        connection.query('DELETE FROM tweets WHERE tweet_id = ? AND user_id = ?', [req.params.id, req.userId], (error, results) => {
            if (error) {
                return res.status(500).send({ error: 'Error deleting tweet' });
            }
            if (!results.affectedRows) {
                return res.status(404).send({ error: 'Tweet not found' });
            }
            res.send({ message: 'Tweet deleted successfully' });
        });

    } catch (error) {

    }
}

function likeTweet(req, res, next) {
    try {
        connection.query('SELECT * FROM tweets WHERE tweet_id = ? AND user_id = ?', [req.params.id, req.userId], (error, results) => {
            if (error) {
                return res.status(500).send({ error: 'Error reading tweet' });
            }
            if (!results.length) {
                return res.status(404).send({ error: 'Tweet not found' });
            }

            // Toggle the like status of the tweet for the authenticated user
            const liked = results[0].liked === 1 ? -1 : 1;

            connection.query('UPDATE tweets SET liked = ? WHERE tweet_id = ? AND user_id = ?', [liked, req.params.id, req.userId], (error) => {
                if (error) {
                    return res.status(500).send({ error: 'Error updating tweet' });
                }
                if (liked === 1) {
                    return res.send({ message: 'You just liked a tweet!' });
                }
                else if (liked === -1) {
                    return res.send({ message: 'You just disliked a tweet!' });
                }
                res.status(500).send({ error: 'Error updating tweet' });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

function retweet(req, res, next) {
    try {
        connection.query('SELECT * FROM tweets WHERE tweet_id = ?', [req.params.id], (error, results) => {
            if (error) {
                return res.status(500).send({ error: 'Error reading tweet' });
            }
            if (!results.length) {
                return res.status(404).send({ error: 'Tweet not found' });
            }

            // Create a new tweet with the same content as the original tweet
            let datetime = new Date();
            let params = { tweet_id: v4(), title: results[0].title, description: results[0].description, user_id: req.userId, original_tweet_id: req.params.id, created_at: datetime, updated_at: datetime };

            const query = 'INSERT INTO tweets SET ?';

            connection.query(query, params, (error, results) => {
                if (error) {
                    return res.status(500).send({ error: 'Error creating tweet' });
                }
                res.send({ message: 'Tweet created successfully' });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

function createThread(req, res, next) {
    try {
        connection.query('SELECT * FROM tweets WHERE tweet_id = ?', [req.params.id], (error, results) => {
            if (error) {
                return res.status(500).send({ error: 'Error reading tweet' });
            }
            if (!results.length) {
                return res.status(404).send({ error: 'Tweet not found' });
            }
            
            // Create a new tweet with the same content as the original tweet
            const { title, description } = req.body;

            if (!title || !description) {
                return res.status(400).send({ error: 'Title and description are required' });
            }

            let datetime = new Date();
            let params = { tweet_id: v4(), title: title, description: description, parent_id: req.params.id, user_id: req.userId, created_at: datetime, updated_at: datetime };

            const query = 'INSERT INTO tweets SET ?';

            connection.query(query, params, (error, results) => {
                if (error) {
                    console.log(error)
                    return res.status(500).send({ error: 'Error creating thread' });
                }
                res.send({ message: 'Thread created successfully' });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getTweets,
    getTweetDetails,
    createTweet,
    updateTweet,
    deleteTweet,
    likeTweet,
    retweet,
    createThread,
};