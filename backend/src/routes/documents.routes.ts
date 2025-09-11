import express from 'express';
import userAuth from '../middlewares/user.auth';
import { handleMultipleFileUpload } from '../utils/multer.utils';
import documentController from '../controllers/document.controller';

const router = express.Router();

router.post(
  '/upload',
  userAuth,
  handleMultipleFileUpload('document'),
  documentController.uploadDocument,
);

router.get('/', userAuth, documentController.getUserDocuments);
router.get(
  '/generate/:id',
  userAuth,
  documentController.generateDocumentFlashcards,
);

export default router;
