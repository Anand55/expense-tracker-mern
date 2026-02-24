import { Router } from 'express';
import * as authController from './auth.controller';
import { validateBody } from '../../middleware/validate';
import { authMiddleware } from '../../middleware/auth';
import { registerSchema, loginSchema } from './auth.schema';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.me);

export default router;
