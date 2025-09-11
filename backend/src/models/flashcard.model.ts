import mongoose, { Document, Schema } from 'mongoose';

export interface IFlashcard extends Document {
  owner: mongoose.Types.ObjectId;
  document: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
}

const flashcardSchema = new Schema<IFlashcard>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    document: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
  },
  { timestamps: true },
);

// Indexes for faster queries
flashcardSchema.index({ owner: 1, document: 1 });
flashcardSchema.index({ owner: 1, createdAt: -1 });
flashcardSchema.index({ tags: 1 });

export default mongoose.model<IFlashcard>('Flashcard', flashcardSchema);
