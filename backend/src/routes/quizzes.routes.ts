import express from 'express';
import userAuth from '../middlewares/user.auth';
import quizzesController from '../controllers/quizzes.controller';
import { submitQuizSchema } from '../validations/quizzes.zod';
import validate from '../middlewares/validation.zod';

const router = express.Router();

router.get('/', userAuth, quizzesController.getAllQuizzes);

router.get('/:id', userAuth, quizzesController.getQuizById);

router.post(
  '/:id/attempt',
  userAuth,
  validate(submitQuizSchema),
  quizzesController.submitQuiz,
);

router.get('/attempts/:id', userAuth, quizzesController.getQuizResults);

router.get('/generate/:documentId', userAuth, quizzesController.generateQuiz);

export default router;
