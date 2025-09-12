import type { Socket } from 'socket.io-client';

import { io } from 'socket.io-client';

import { CONFIG } from 'src/global-config';

export interface Message {
  id: string;
  text: string;
  userId: string;
  username: string;
  avatar?: string;
  chatRoom: string;
  timestamp: Date;
}

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
}

class ChatService {
  private socket: Socket | null = null;
  private token: string | null = null;

  initialize(token: string) {
    console.log('Initializing chat service with token:', token ? 'Token present' : 'No token');
    console.log('Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'No token');
    this.token = token;
    const serverUrl = CONFIG.serverUrl || 'http://localhost:3001';
    console.log('CONFIG.serverUrl:', CONFIG.serverUrl);
    console.log('Connecting to server:', serverUrl);
    this.socket = io(serverUrl, {
      auth: {
        token,
      },
      autoConnect: true,
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true,
    });

    this.setupEventHandlers();
    console.log('Chat service initialized');
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to chat server, socket ID:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from chat server, reason:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚨 Connection error:', error.message, error);
    });

    this.socket.on('error', (error) => {
      console.error('🚨 Socket error:', error);
    });
  }

  connect() {
    console.log('Attempting to connect to chat server...');
    if (this.socket) {
      if (!this.socket.connected) {
        this.socket.connect();
        console.log('Socket connect() called');
      } else {
        console.log('Socket already connected');
      }
    } else {
      console.log('No socket available to connect');
    }
  }

  disconnect() {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
  }

  joinRoom(roomId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('join_room', roomId);
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('leave_room', roomId);
    }
  }

  sendMessage(text: string, chatRoom: string = 'general') {
    console.log('Attempting to send message:', { text, chatRoom, connected: this.socket?.connected });
    if (this.socket && this.socket.connected) {
      this.socket.emit('send_message', { text, chatRoom });
      console.log('Message emitted to server');
    } else {
      console.error('Cannot send message - socket not connected');
    }
  }

  startTyping(chatRoom: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing_start', { chatRoom });
    }
  }

  stopTyping(chatRoom: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing_stop', { chatRoom });
    }
  }

  // Event listeners
  onNewMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onUserJoined(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_joined', callback);
    }
  }

  onUserLeft(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_left', callback);
    }
  }

  onUserTyping(callback: (data: { userId: string; username: string }) => void) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserStoppedTyping(callback: (data: { userId: string }) => void) {
    if (this.socket) {
      this.socket.on('user_stopped_typing', callback);
    }
  }

  // Remove event listeners
  off(event: string, callback?: any) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // API calls for chat history and users
  async getMessages(roomId: string = 'general', page: number = 1, limit: number = 50): Promise<{ messages: Message[]; pagination: any }> {
    const serverUrl = CONFIG.serverUrl || 'http://localhost:3001';
    const response = await fetch(`${serverUrl}/api/chat/messages/${roomId}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const data = await response.json();
    return data.data;
  }

  async getActiveUsers(roomId: string = 'general'): Promise<ChatUser[]> {
    const serverUrl = CONFIG.serverUrl || 'http://localhost:3001';
    const response = await fetch(`${serverUrl}/api/chat/users/${roomId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch active users');
    }

    const data = await response.json();
    return data.data.users;
  }

  async deleteMessage(messageId: string): Promise<void> {
    const serverUrl = CONFIG.serverUrl || 'http://localhost:3001';
    const response = await fetch(`${serverUrl}/api/chat/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete message');
    }
  }
}

export const chatService = new ChatService();
