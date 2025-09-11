import mongoose, { Document, Schema } from 'mongoose';

export interface IAttempt extends Document {
  owner: mongoose.Types.ObjectId;
  quiz: mongoose.Types.ObjectId;
  score: number;
  answers: {
    questionIndex: number;
    userAnswer: string;
    isCorrect: boolean;
  }[];
  duration: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema({
  questionIndex: {
    type: Number,
    required: true,
  },
  userAnswer: {
    type: String,
    required: true,
    trim: true,
  },
  isCorrect: { type: Boolean, required: true },
});

const attemptSchema = new Schema<IAttempt>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    answers: [answerSchema],
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

// Indexes for faster queries
attemptSchema.index({ owner: 1, quiz: 1 });
attemptSchema.index({ owner: 1, createdAt: -1 });
attemptSchema.index({ quiz: 1, score: -1 });

export default mongoose.model<IAttempt>('Attempt', attemptSchema);
