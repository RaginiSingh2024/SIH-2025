import path from 'path';
import { Response, Request } from 'express';
import userModel from '../models/user.model';
import catchAsync from '../utils/catchAsync.utils';
import flashcardModel from '../models/flashcard.model';
import documentModel from '../models/document.model';
import ExpressResponse from '../libs/express/response.libs';
import { parseFile, chunkText, deleteFile } from '../utils/fileParser.utils';
import {
  flashcardDataType,
  generateFlashcards,
} from '../services/groq.service';

class documentController {
  public uploadDocument = catchAsync(async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0)
      return ExpressResponse.badRequest(res, 'No files uploaded');

    const files = req.files.filter((file) => file.fieldname === 'document');

    if (files.length === 0)
      return ExpressResponse.badRequest(res, 'No document files uploaded');

    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) return ExpressResponse.notFound(res, 'User not found');

    for (let file of files) {
      const title = file.originalname.split('.').slice(0, -1).join('_');

      const fileExtension = path.extname(file.originalname).toLowerCase();

      let fileType: 'pdf' | 'docx' | 'txt';

      switch (fileExtension) {
        case '.pdf':
          fileType = 'pdf';
          break;
        case '.docx':
          fileType = 'docx';
          break;
        case '.txt':
          fileType = 'txt';
          break;
        default:
          deleteFile(file.path);
          continue;
      }

      try {
        const text = await parseFile(file.path, fileType);

        if (!text || text.trim().length === 0) {
          deleteFile(file.path);
          continue;
        }

        const document = new documentModel({
          owner: req.userId,
          title,
          type: fileType,
          originalName: file.originalname,
          text,
          size: file.size,
          flashCardStatus: false,
        });

        await document.save();

        deleteFile(file.path);
      } catch (error) {
        deleteFile(file.path);
        continue;
      }
    }

    return ExpressResponse.accepted(res, 'Files uploaded successfully');
  });

  public generateDocumentFlashcards = catchAsync(
    async (req: Request, res: Response) => {
      const documentId = req.params.id;
      const count = parseInt(req.query.count as string) || 10;

      const document = await documentModel.findById(documentId);
      if (!document) return ExpressResponse.notFound(res, 'Document not found');

      if (document.flashCardStatus)
        return ExpressResponse.badRequest(res, 'Flashcards already generated');

      const textChunks = chunkText(document.text, 3000);

      const flashcardList: flashcardDataType[] = [];

      for (const chunk of textChunks) {
        const chunkFlashcards = await generateFlashcards(
          chunk,
          Math.ceil(count / textChunks.length),
        );
        flashcardList.push(...chunkFlashcards);
      }

      const flashcardInserts = flashcardList.map((fc) => ({
        owner: req.userId,
        document: document._id,
        question: fc.question,
        answer: fc.answer,
        tags: fc.tags || [],
        difficulty: fc.difficulty || 'medium',
      }));

      await flashcardModel.insertMany(flashcardInserts);

      document.flashCardStatus = true;
      await document.save();

      return ExpressResponse.accepted(res, 'Flashcards generated successfully');
    },
  );

  public getUserDocuments = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // const documents = await documentModel
    //   .find({ owner: req.userId })
    //   .sort({ createdAt: -1 })
    //   .skip(skip)
    //   .limit(limit)
    //   .select('-text');

    // count of flashcards for each document
    // count of quizzes for each document
    const documents = await documentModel.aggregate([
      { $match: { owner: req.userId } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'flashcards',
          localField: '_id',
          foreignField: 'document',
          as: 'flashSize',
        },
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: 'document',
          as: 'quizSize',
        },
      },
      {
        $addFields: {
          flashcards: { $size: '$flashSize' },
          quizzes: { $size: '$quizSize' },
        },
      },
      { $project: { text: 0, flashSize: 0, quizSize: 0 } },
    ]);

    const total = await documentModel.countDocuments({ owner: req.userId });

    return ExpressResponse.success(res, 'Documents retrieved successfully', {
      documents,
      pagination: { current: page, pages: Math.ceil(total / limit), total },
    });
  });
}

export default new documentController();
