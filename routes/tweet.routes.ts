import express from 'express';
import { addTwitterAccount, getTweetsOfUser, testTweet } from '../controller/twitter.controller';

const router = express.Router();

// POST: /add-twitter-account/:userId
router.post('/add/:userId', addTwitterAccount);

// GET: /tweets/:userId
router.get('/tweets/:userId', getTweetsOfUser);

// POST: /test-tweet/:userId
router.post('/test-tweet', testTweet);


export default router;