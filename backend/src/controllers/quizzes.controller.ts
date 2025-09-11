import mongoose from 'mongoose';
import { Response, Request } from 'express';
import catchAsync from '../utils/catchAsync.utils';
import documentModel from '../models/document.model';
import quizModel from '../models/quiz.model';
import ExpressResponse from '../libs/express/response.libs';
import { SubmitQuizType } from '../validations/quizzes.zod';
import { chunkText } from '../utils/fileParser.utils';
import {
  generateQuizQuestions,
  quizQuestionDataType,
} from '../services/groq.service';

class quizController {
  getAllQuizzes = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const documentIds = req.query.document as string;

    const filter: any = { owner: req.userId };

    if (documentIds) {
      const documents = documentIds
        .split(',')
        .map((id) => id.trim())
        .filter((id) => mongoose.Types.ObjectId.isValid(id));
      filter.document = { $in: documents };
    }

    const quizzes = await quizModel
      .find(filter)
      .populate('document', 'title type originalName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-item.correctAnswer -item.explanation')
      .lean();

    const total = await quizModel.countDocuments(filter);

    return ExpressResponse.success(res, 'Quizzes retrieved successfully', {
      quizzes,
      pagination: { current: page, pages: Math.ceil(total / limit), total },
    });
  });

  getQuizById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid quiz ID');
    }

    const quiz = await quizModel
      .findOne({ _id: id, owner: req.userId })
      .populate('document', 'title type originalName')
      .select('-items.correctAnswer -items.explanation')
      .lean();

    if (!quiz) return ExpressResponse.notFound(res, 'Quiz not found');

    if (quiz.items.length === 0)
      return ExpressResponse.badRequest(res, 'Quiz has no items');

    if (quiz.attempted)
      return ExpressResponse.badRequest(res, 'Quiz has already been attempted');

    return ExpressResponse.success(res, 'Quiz retrieved successfully', {
      quiz,
    });
  });

  generateQuiz = catchAsync(async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const count = parseInt(req.query.count as string) || 10;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return ExpressResponse.badRequest(res, 'Invalid document ID');
    }

    const document = await documentModel.findOne({
      _id: documentId,
      owner: req.userId,
    });

    if (!document) return ExpressResponse.notFound(res, 'Document not found');

    const textChunks = chunkText(document.text, 3000);

    const quizItems: quizQuestionDataType[] = [];

    for (const chunk of textChunks) {
      const chunkQuestions = await generateQuizQuestions(
        chunk,
        Math.ceil(count / textChunks.length),
      );
      quizItems.push(...chunkQuestions);
    }

    // create quiz
    const quiz = new quizModel({
      owner: req.userId,
      document: documentId,
      title: document.title,
      items: quizItems,
      attempted: false,
      score: 0,
      duration: 0,
    });

    await quiz.save();

    return ExpressResponse.success(res, 'Quiz generated successfully', {
      quizId: quiz._id,
    });
  });

  submitQuiz = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { answers, duration } = req.body as SubmitQuizType;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid quiz ID');
    }

    const quiz = await quizModel.findOne({ _id: id, owner: req.userId });

    if (!quiz) return ExpressResponse.notFound(res, 'Quiz not found');

    if (quiz.items.length === 0)
      return ExpressResponse.badRequest(res, 'Quiz has no items');

    if (quiz.attempted)
      return ExpressResponse.badRequest(res, 'Quiz has already been attempted');

    if (
      !answers ||
      !Array.isArray(answers) ||
      answers.length !== quiz.items.length
    ) {
      return ExpressResponse.badRequest(
        res,
        'Answers must be an array matching the number of quiz items',
      );
    }

    // Evaluate answers
    let score = 0;
    const updatedItems = quiz.items.map((item, index) => {
      const userAnswerObj = answers.find((ans) => ans.questionIndex === index);
      let isCorrect = false;

      const userAnswer = userAnswerObj ? userAnswerObj.userAnswer : '';
      const correctAnswer = item.correctAnswer || '';
      if (item.kind === 'true_false') {
        isCorrect = userAnswer === correctAnswer;
      } else if (item.kind === 'mcq') {
        isCorrect = userAnswer === correctAnswer;
      } else if (item.kind === 'fill_blank') {
        isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
      }

      if (isCorrect) score++;

      return { ...item, userAnswer, isCorrect };
    });

    quiz.items = updatedItems;
    quiz.attempted = true;
    quiz.attemptedDate = new Date();
    quiz.score = Math.round((score / quiz.items.length) * 100); // Score as percentage
    quiz.duration = duration || 0;

    await quiz.save();

    return ExpressResponse.accepted(res, 'Quiz submitted successfully');
  });

  getQuizResults = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ExpressResponse.badRequest(res, 'Invalid quiz ID');
    }

    const quiz = await quizModel
      .findOne({ _id: id, owner: req.userId })
      .populate('document', 'title type originalName')
      .lean();

    if (!quiz) return ExpressResponse.notFound(res, 'Quiz not found');

    if (!quiz.attempted)
      return ExpressResponse.badRequest(res, 'Quiz has not been attempted yet');

    return ExpressResponse.success(res, 'Quiz results retrieved successfully', {
      quiz,
    });
  });
}

export default new quizController();
