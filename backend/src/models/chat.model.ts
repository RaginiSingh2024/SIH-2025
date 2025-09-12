import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  text: string;
  userId: string;
  username: string;
  avatar?: string;
  timestamp: Date;
  chatRoom: string; // For different batch/classroom rooms
}

const MessageSchema: Schema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    chatRoom: {
      type: String,
      required: true,
      default: 'general', // Default room for batch chat
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
MessageSchema.index({ chatRoom: 1, createdAt: 1 });
MessageSchema.index({ userId: 1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
