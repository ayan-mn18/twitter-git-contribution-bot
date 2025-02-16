import express from 'express';
import userRoutes from './user.routes';
import twitterRoutes from './tweet.routes';
import jobRoutes from './job.routes';
import platformRoutes from './platform.routes';

const router = express.Router();

// Mount route modules
router.use('/users', userRoutes);
router.use('/twitter', twitterRoutes);
router.use('/jobs', jobRoutes);
router.use('/platforms', platformRoutes);

export default router;
