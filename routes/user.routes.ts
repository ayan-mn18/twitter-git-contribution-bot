import express from 'express';
import { createUser } from '../controller';

const router = express.Router();

// POST: /create-user
router.post('/create', createUser);

// DELETE: /delete-user/:userId
router.delete('/delete/:userId', (req, res) => {
  res.send('Delete a user');
});

export default router;