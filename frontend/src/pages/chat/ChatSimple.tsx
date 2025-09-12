import type { Message } from 'src/services/chat.service';

import { useRef, useState, useEffect } from 'react';

import {
  Box,
  Card,
  Chip,
  Paper,
  Stack,
  Avatar,
  Container,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useAuthContext } from 'src/auth/hooks';

// Mock chat service using session storage
const CHAT_STORAGE_KEY = 'chat_messages';

const mockChatService = {
  getMessages: (): Message[] => {
    const stored = sessionStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Initial mock messages
    const initialMessages: Message[] = [
      {
        id: '1',
        text: 'Hey everyone! Welcome to the CSE 2023 batch chat!',
        userId: 'user1',
        username: 'Alex Kumar',
        chatRoom: 'general',
        timestamp: new Date('2025-09-11T10:00:00'),
      },
      {
        id: '2',
        text: 'Thanks! Excited to connect with everyone here.',
        userId: 'user2',
        username: 'Sarah Johnson',
        chatRoom: 'general',
        timestamp: new Date('2025-09-11T10:05:00'),
      },
      {
        id: '3',
        text: 'Has anyone started working on the final project yet?',
        userId: 'user3',
        username: 'Michael Chen',
        chatRoom: 'general',
        timestamp: new Date('2025-09-11T10:15:00'),
      },
    ];
    
    sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(initialMessages));
    return initialMessages;
  },

  sendMessage: (text: string, userId: string, username: string): Message => {
    const messages = mockChatService.getMessages();
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      userId,
      username,
      chatRoom: 'general',
      timestamp: new Date(),
    };
    
    const updatedMessages = [...messages, newMessage];
    sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedMessages));
    return newMessage;
  },
};

// ----------------------------------------------------------------------

export default function Chat() {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages on component mount
  useEffect(() => {
    const loadedMessages = mockChatService.getMessages();
    setMessages(loadedMessages);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;

    const messageText = inputValue.trim();
    setInputValue('');

    try {
      const newMessage = mockChatService.sendMessage(messageText, user.id, user.name);
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const formatTime = (date: Date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const isCurrentUser = (message: Message) => message.userId === user?.id;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Batch Chat
      </Typography>

      <Card sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
        {/* Chat Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">General Chat</Typography>
          <Chip
            label="CSE 2023"
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Messages Area */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Scrollbar sx={{ height: '100%', p: 2 }}>
            <Stack spacing={2}>
              {messages.map((message) => {
                const isOwn = isCurrentUser(message);
                return (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: isOwn ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Stack
                      direction={isOwn ? 'row-reverse' : 'row'}
                      spacing={1}
                      alignItems="flex-end"
                      sx={{ maxWidth: '70%' }}
                    >
                      {!isOwn && (
                        <Avatar
                          src={message.avatar}
                          alt={message.username}
                          sx={{ width: 32, height: 32 }}
                        >
                          {message.username?.charAt(0) || '?'}
                        </Avatar>
                      )}
                      
                      <Box>
                        {!isOwn && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 1, mb: 0.5, display: 'block' }}
                          >
                            {message.username}
                          </Typography>
                        )}
                        
                        <Paper
                          elevation={1}
                          sx={{
                            p: 1.5,
                            bgcolor: isOwn ? 'primary.main' : 'background.paper',
                            color: isOwn ? 'primary.contrastText' : 'text.primary',
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="body2">{message.text}</Typography>
                        </Paper>
                        
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            textAlign: isOwn ? 'right' : 'left',
                            mt: 0.5,
                          }}
                        >
                          {formatTime(new Date(message.timestamp))}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
              <div ref={messagesEndRef} />
            </Stack>
          </Scrollbar>
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} component="form" onSubmit={handleSendMessage} alignItems="flex-end">
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={!inputValue.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                height: 40,
                width: 40,
                flexShrink: 0,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&.Mui-disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'action.disabled',
                },
              }}
            >
              <Iconify icon="eva:arrow-forward-fill" width={20} />
            </IconButton>
          </Stack>
        </Box>
      </Card>
    </Container>
  );
}
