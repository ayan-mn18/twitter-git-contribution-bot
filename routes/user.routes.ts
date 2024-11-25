import express from 'express';
import { createUser, deleteUser, signInUser } from '../controller';

const router = express.Router();

// POST: /create-user
router.post('/create', createUser);

// POST: /create-user
router.post('/signin', signInUser);

// DELETE: /delete-user/:userId
router.delete('/delete/:userId', deleteUser);

export default router;