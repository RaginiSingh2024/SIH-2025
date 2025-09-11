import express from 'express';
import flashcardController from '../controllers/flashcard.controller';
import userAuth from '../middlewares/user.auth';

const router = express.Router();

router.get('/', userAuth, flashcardController.getAllFlashcards);

router.get(
  '/document/:documentId/export',
  userAuth,
  flashcardController.exportFlashcardsPdf,
);

export default router;
