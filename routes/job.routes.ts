import express from 'express';
import { activateJobController, deActivateJobController, editJobController } from '../controller';

const router = express.Router();

// PUT: /edit-job/:userId
router.put('/edit/:userId', editJobController);

// PUT: /activate-bot/:userId
router.put('/activate-bot/:userId', activateJobController);

// PUT: /deactivate-bot/:userId
router.put('/deactivate-bot/:userId', deActivateJobController);

export default router;
