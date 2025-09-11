import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  owner: mongoose.Types.ObjectId;
  title: string;
  type: 'pdf' | 'docx' | 'txt';
  originalName: string;
  text: string;
  size: number;
  flashCardStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['pdf', 'docx', 'txt'] },
    originalName: { type: String, required: true },
    text: { type: String, required: true },
    size: { type: Number, required: true },
    flashCardStatus: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Index for faster queries
documentSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.model<IDocument>('Document', documentSchema);
