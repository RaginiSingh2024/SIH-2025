import express from 'express';
import userAuth from '../middlewares/user.auth';

import authController from '../controllers/auth.controller';
import validate from '../middlewares/validation.zod';
import { registerSchema, loginSchema } from '../validations/auth.zod';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);

router.post('/login', validate(loginSchema), authController.login);

router.get('/me', userAuth, authController.getProfile);

export default router;
