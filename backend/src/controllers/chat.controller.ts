import { Request, Response } from 'express';
import mongoose from 'mongoose';

import ExpressResponse from '../libs/express/response.libs';
import catchAsync from '../utils/catchAsync.utils';

import { Message } from '../models/chat.model';
import userModel from '../models/user.model';

// This will be set by the main app
export let socketService: any = null;

export const setSocketService = (service: any) => {
  socketService = service;
};

// Get messages for a chat room
export const getMessages = catchAsync(
  async (req: Request, res: Response) => {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ chatRoom: roomId })
      .sort({ createdAt: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    // Reverse to show oldest first
    messages.reverse();

    return ExpressResponse.success(res, 'Messages fetched successfully', {
      messages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: await Message.countDocuments({ chatRoom: roomId }),
      },
    });
  }
);

// Send a new message
export const sendMessage = catchAsync(
  async (req: Request, res: Response) => {
    const { text, chatRoom = 'general' } = req.body;
    const userId = req.userId;

    if (!text || text.trim() === '') {
      return ExpressResponse.badRequest(res, 'Message text is required');
    }

    if (text.length > 1000) {
      return ExpressResponse.badRequest(res, 'Message too long');
    }

    // Get user details
    const user = await userModel.findById(userId);
    if (!user) {
      return ExpressResponse.unauthorized(res, 'User not found');
    }

    const message = new Message({
      text: text.trim(),
      userId: userId.toString(),
      username: user.name,
      avatar: '', // User model doesn't have avatar field yet
      chatRoom,
    });

    await message.save();

    const messageData = {
      id: message._id,
      text: message.text,
      userId: message.userId,
      username: message.username,
      avatar: message.avatar,
      chatRoom: message.chatRoom,
      timestamp: new Date(),
    };

    // Emit to Socket.IO if available
    if (socketService) {
      socketService.sendToRoom(chatRoom, 'new_message', messageData);
    }

    return ExpressResponse.success(res, 'Message sent successfully', {
      message: messageData,
    });
  }
);

// Get active users in chat room
export const getActiveUsers = catchAsync(
  async (req: Request, res: Response) => {
    const { roomId } = req.params;

    // Get users who sent messages in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const activeUserIds = await Message.distinct('userId', {
      chatRoom: roomId,
      createdAt: { $gte: twentyFourHoursAgo },
    });

    const activeUsers = await userModel
      .find({ _id: { $in: activeUserIds } })
      .select('name email')
      .lean();

    return ExpressResponse.success(res, 'Active users fetched successfully', {
      users: activeUsers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: '', // Default empty avatar
        status: 'online', // Can be enhanced with real-time status
      })),
    });
  }
);

// Delete a message (only own messages)
export const deleteMessage = catchAsync(
  async (req: Request, res: Response) => {
    const { messageId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return ExpressResponse.badRequest(res, 'Invalid message ID');
    }

    const message = await Message.findOne({
      _id: messageId,
      userId: userId.toString(),
    });

    if (!message) {
      return ExpressResponse.notFound(res, 'Message not found or unauthorized');
    }

    await Message.findByIdAndDelete(messageId);

    return ExpressResponse.success(res, 'Message deleted successfully', {});
  }
);
