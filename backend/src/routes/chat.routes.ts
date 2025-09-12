import { Router } from 'express';
import { 
  getMessages, 
  sendMessage, 
  getActiveUsers,
  deleteMessage 
} from '../controllers/chat.controller';
import authenticateUser from '../middlewares/user.auth';

const router = Router();

// Get all messages for a chat room
router.get('/messages/:roomId', authenticateUser, getMessages);

// Send a new message
router.post('/messages', authenticateUser, sendMessage);

// Get active users in chat
router.get('/users/:roomId', authenticateUser, getActiveUsers);

// Delete a message (only own messages)
router.delete('/messages/:messageId', authenticateUser, deleteMessage);

export default router;
