import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
} from '../controllers/messageController.js';
import protectedRoute from '../middleware/protectedRoute.js';

const router = express.Router();

router.get('/conversations', protectedRoute, getConversations);
router.get('/:otherUserId', protectedRoute, getMessages);
router.post('/', protectedRoute, sendMessage);

export default router;
