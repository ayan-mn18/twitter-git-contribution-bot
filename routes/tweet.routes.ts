import express from 'express';

const router = express.Router();

// POST: /add-twitter-account/:userId
router.post('/add/:userId', (req, res) => {
  res.send('Add a Twitter account for a user');
});

// GET: /tweets/:userId
router.get('tweets/:userId', (req, res) => {
  res.send('Get tweets for a user sorted by date and time');
});


export default router;