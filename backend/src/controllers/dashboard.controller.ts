import { Response, Request } from 'express';
import catchAsync from '../utils/catchAsync.utils';
import documentModel from '../models/document.model';
import quizModel from '../models/quiz.model';
import flashcardModel from '../models/flashcard.model';

import ExpressResponse from '../libs/express/response.libs';

class dashboardController {
  getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;

    const dtaDoc = await documentModel.find({ owner: userId }).lean();
    const dtaFlashcard = await flashcardModel.find({ owner: userId }).lean();
    const dtaQuiz = await quizModel.find({ owner: userId }).lean();

    const totalDoc = dtaDoc.length;
    const totalFlashcard = dtaFlashcard.length;
    const totalQuiz = dtaQuiz.length;

    const quizList = dtaQuiz
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .filter((quiz) => quiz.attempted)
      .slice(0, 4)
      .map((quiz) => ({
        _id: quiz._id,
        title: quiz.title,
        totalQues: quiz.items.length,
        correctAnswer: quiz.items.filter((item) => item.isCorrect).length,
      }));

    const documentGenerated = dtaDoc.filter(
      (doc) => doc.flashCardStatus,
    ).length;
    const documentWaiting = totalDoc - documentGenerated;

    const allQuizQues = dtaQuiz.reduce(
      (acc, quiz) => [...acc, ...quiz.items],
      [] as (typeof dtaQuiz)[0]['items'],
    );

    const easyQuiz = allQuizQues.filter(
      (item) => item.difficulty === 'easy',
    ).length;
    const mediumQuiz = allQuizQues.filter(
      (item) => item.difficulty === 'medium',
    ).length;
    const hardQuiz = allQuizQues.filter(
      (item) => item.difficulty === 'hard',
    ).length;

    const totalAttemptedQuiz = dtaQuiz.filter((quiz) => quiz.attempted).length;

    const avgDuration =
      dtaQuiz
        .filter((quiz) => quiz.attempted)
        .reduce((acc, quiz) => acc + quiz.duration, 0) /
      (totalAttemptedQuiz || 1);
    const percentAvgDuration = (avgDuration / 600) * 100; // assuming 10 min max duration

    const avgScore =
      dtaQuiz
        .filter((quiz) => quiz.attempted)
        .reduce((acc, quiz) => acc + quiz.score, 0) / (totalAttemptedQuiz || 1);
    const percentAvgScore = (avgScore / 100) * 100; // assuming max score is 100

    const allFlashcardTags = dtaFlashcard.reduce(
      (acc, card) => [...acc, ...card.tags],
      [] as string[],
    );
    const totalFlashcardTags = new Set(allFlashcardTags).size;
    const flashCardsTags = Array.from(new Set(allFlashcardTags))
      .map((tag) => ({
        label: tag,
        value: allFlashcardTags.filter((t) => t === tag).length,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // top 5 tags

    return ExpressResponse.success(
      res,
      'Dashboard stats retrieved successfully',
      {
        totalDoc,
        totalFlashcard,
        totalQuiz,
        quizList,
        documentGenerated,
        documentWaiting,
        easyQuiz,
        mediumQuiz,
        hardQuiz,
        totalQues: allQuizQues.length,
        avgDuration: Math.round(avgDuration * 100) / 100,
        percentAvgDuration: Math.round(percentAvgDuration * 100) / 100,
        avgScore: Math.round(avgScore * 100) / 100,
        percentAvgScore: Math.round(percentAvgScore * 100) / 100,
        totalFlashcardTags,
        flashCardsTags,
      },
    );
  });
}

export default new dashboardController();
