import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwtCommon from '../libs/jwt/common.libs';
import userModel from '../models/user.model';
import mongoose from 'mongoose';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

export class SocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:8081',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Temporarily disable authentication for debugging
    this.io.use(async (socket: any, next) => {
      console.log('🔌 Socket connection attempt from:', socket.handshake.address);
      console.log('🔑 Auth data:', socket.handshake.auth);
      
      // For debugging - let everyone connect
      socket.userId = 'debug-user';
      socket.username = 'Debug User';
      console.log('✅ Debug authentication successful');
      next();
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User ${socket.username} connected with socket ${socket.id}`);

      // Store user connection
      if (socket.userId) {
        this.connectedUsers.set(socket.userId, socket.id);
      }

      // Join chat room
      socket.on('join_room', (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.username} joined room ${roomId}`);
        
        // Notify others in the room about new user
        socket.to(roomId).emit('user_joined', {
          userId: socket.userId,
          username: socket.username,
          message: `${socket.username} joined the chat`,
        });
      });

      // Leave chat room
      socket.on('leave_room', (roomId: string) => {
        socket.leave(roomId);
        console.log(`User ${socket.username} left room ${roomId}`);
        
        // Notify others in the room about user leaving
        socket.to(roomId).emit('user_left', {
          userId: socket.userId,
          username: socket.username,
          message: `${socket.username} left the chat`,
        });
      });

      // Handle new message
      socket.on('send_message', (data: {
        text: string;
        chatRoom: string;
      }) => {
        console.log('Received message from', socket.username, ':', data);
        
        // Broadcast message to all users in the room
        const messageData = {
          id: Date.now().toString(), // Temporary ID, will be replaced by DB ID
          text: data.text,
          userId: socket.userId,
          username: socket.username,
          chatRoom: data.chatRoom,
          timestamp: new Date(),
        };
        
        console.log('Broadcasting message to room', data.chatRoom, ':', messageData);
        this.io.to(data.chatRoom).emit('new_message', messageData);
      });

      // Handle typing indicators
      socket.on('typing_start', (data: { chatRoom: string }) => {
        socket.to(data.chatRoom).emit('user_typing', {
          userId: socket.userId,
          username: socket.username,
        });
      });

      socket.on('typing_stop', (data: { chatRoom: string }) => {
        socket.to(data.chatRoom).emit('user_stopped_typing', {
          userId: socket.userId,
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User ${socket.username} disconnected`);
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
        }
      });
    });
  }

  // Method to send message to specific user
  public sendToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Method to send message to room
  public sendToRoom(roomId: string, event: string, data: any) {
    this.io.to(roomId).emit(event, data);
  }

  // Get online users count for a room
  public async getRoomUsersCount(roomId: string): Promise<number> {
    const sockets = await this.io.in(roomId).fetchSockets();
    return sockets.length;
  }
}
