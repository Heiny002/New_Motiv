import express from 'express';
import { authenticateUser } from '../middleware/auth';
import {
    sendMessage,
    getConversationHistory,
    getConversation
} from '../controllers/coach.controller';

const router = express.Router();

// All coach routes require authentication
router.use(authenticateUser);

// Send a message to the coach
router.post('/message', sendMessage);

// Get conversation history
router.get('/conversations', getConversationHistory);

// Get a specific conversation
router.get('/conversations/:conversationId', getConversation);

export default router; 