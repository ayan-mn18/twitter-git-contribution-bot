import express from 'express';

const router = express.Router();

// PUT: /edit-job/:userId
router.put('/edit/:userId', (req, res) => {
  res.send('Edit a job for a user');
});

// PUT: /activate-bot/:userId
router.put('/activate-bot/:userId', (req, res) => {
  res.send('Activate the bot for a user');
});

// PUT: /deactivate-bot/:userId
router.put('/deactivate-bot/:userId', (req, res) => {
  res.send('Deactivate the bot for a user');
});

export default router;
