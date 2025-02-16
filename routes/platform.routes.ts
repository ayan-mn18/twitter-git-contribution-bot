import express from 'express';
import { checkValidGithubUsername, checkValidLeetcodeUsername } from '../controller/plaform.controller';

const router = express.Router();

router.post('/check-valid-gh', checkValidGithubUsername);
router.post('/check-valid-lc', checkValidLeetcodeUsername);

export default router;