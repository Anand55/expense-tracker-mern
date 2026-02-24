import { Router } from 'express';
import * as summaryController from './summary.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);
router.get('/', summaryController.get);

export default router;
