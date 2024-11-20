import express from 'express';
import { createUser, deleteUser } from '../controller';

const router = express.Router();

// POST: /create-user
router.post('/create', createUser);

// DELETE: /delete-user/:userId
router.delete('/delete/:userId', deleteUser);

export default router;