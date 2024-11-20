import express from 'express';

const router = express.Router();

// POST: /create-user
router.post('/create', (req, res) => {
  res.send('Create a user');
});

// DELETE: /delete-user/:userId
router.delete('/delete/:userId', (req, res) => {
  res.send('Delete a user');
});

export default router;