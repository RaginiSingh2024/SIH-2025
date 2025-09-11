import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizItem {
  kind: 'mcq' | 'true_false' | 'fill_blank';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  userAnswer: string;
  isCorrect: boolean;
}

export interface IQuiz extends Document {
  owner: mongoose.Types.ObjectId;
  document: mongoose.Types.ObjectId;
  title: string;
  items: IQuizItem[];
  attempted: boolean; // Indicates if the quiz has been attempted
  attemptedDate?: Date; // Date when the quiz was attempted
  score: number;
  duration: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}

const quizItemSchema = new Schema<IQuizItem>({
  kind: {
    type: String,
    required: true,
    enum: ['mcq', 'true_false', 'fill_blank'],
  },
  prompt: { type: String, required: true, trim: true },
  options: [{ type: String, trim: true }],
  correctAnswer: { type: String, required: true, trim: true },
  explanation: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  userAnswer: { type: String, trim: true, default: '' },
  isCorrect: { type: Boolean, default: false },
});

const quizSchema = new Schema<IQuiz>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    document: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
    title: { type: String, required: true, trim: true },
    items: [quizItemSchema],
    attempted: { type: Boolean, default: false },
    attemptedDate: { type: Date, default: null },
    score: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

// Indexes for faster queries
quizSchema.index({ owner: 1, document: 1 });
quizSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.model<IQuiz>('Quiz', quizSchema);
