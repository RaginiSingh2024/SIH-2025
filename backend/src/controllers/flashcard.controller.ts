import mongoose from 'mongoose';
import { Response, Request } from 'express';
import catchAsync from '../utils/catchAsync.utils';
import flashcardModel from '../models/flashcard.model';
import documentModel from '../models/document.model';
import ExpressResponse from '../libs/express/response.libs';
import { generateFlashcardsPDF } from '../services/pdf.service';

class flashcardController {
  getAllFlashcards = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const documentIds = req.query.document as string;
    const tags = req.query.tags as string;
    const difficulty = req.query.difficulty as string;

    const filter: any = { owner: req.userId };

    if (documentIds) {
      const documents = documentIds
        .split(',')
        .map((id) => id.trim())
        .filter((id) => mongoose.Types.ObjectId.isValid(id));
      filter.document = { $in: documents };
    }

    if (tags) {
      const tagArray = tags.split(',').map((tag) => tag.trim());
      filter.tags = { $in: tagArray };
    }

    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }

    const flashcards = await flashcardModel
      .find(filter)
      .populate('document', 'title type originalName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await flashcardModel.countDocuments(filter);

    return ExpressResponse.success(res, 'Flashcards retrieved successfully', {
      flashcards,
      pagination: { current: page, pages: Math.ceil(total / limit), total },
    });
  });

  // export flashcards to pdf
  exportFlashcardsPdf = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid flashcard ID');
    }

    // Verify document ownership
    const document = await documentModel.findOne({
      _id: id,
      owner: req.userId,
    });

    if (!document) {
      return ExpressResponse.notFound(res, 'Document not found');
    }

    const flashcard = await flashcardModel.find({
      document: id,
      owner: req.userId,
    });

    if (flashcard.length === 0) {
      return ExpressResponse.notFound(
        res,
        'No flashcards found for this document',
      );
    }

    await generateFlashcardsPDF(
      flashcard,
      res,
      `${document.title} - Flashcards`,
    );
  });
}

export default new flashcardController();
