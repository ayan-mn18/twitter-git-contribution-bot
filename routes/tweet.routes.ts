import express from 'express';
// import { addTwitterAccount } from '../controller/twitter.controller';

const router = express.Router();

// POST: /add-twitter-account/:userId
// router.post('/add/:userId', addTwitterAccount);

// GET: /tweets/:userId
router.get('/tweets/:userId', (req, res) => {
  res.send('Get tweets for a user sorted by date and time');
});


export default router;