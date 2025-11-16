import { Router } from 'express';
import {
  createConversation,
  getConversation,
  getUserConversations,
} from '../controllers/conversationController';
import { sendVoiceMessage } from '../controllers/messageController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { validate, schemas } from '../utils/validation';

const router = Router();

// Create conversation (auth optional for guests)
router.post('/', optionalAuth, validate(schemas.createConversation), createConversation);

// Get user's conversations (auth required)
router.get('/', authenticateToken, getUserConversations);

// Get single conversation (auth optional for guests)
router.get('/:id', optionalAuth, getConversation);

// Send voice message (auth optional for guests)
router.post(
  '/:id/voice-message',
  optionalAuth,
  upload.single('audio'),
  sendVoiceMessage
);

export default router;