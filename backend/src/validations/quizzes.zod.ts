import { z } from 'zod';

export const submitQuizSchema = z.object({
  answers: z
    .array(
      z.object({
        questionIndex: z.number().int().min(0),
        userAnswer: z.string().trim(),
      }),
      'Answers must be an array of answer objects',
    )
    .min(1, 'At least one answer is required'),

  duration: z.number().int().min(0, 'Duration must be non-negative'),
});

export type SubmitQuizType = z.infer<typeof submitQuizSchema>;
