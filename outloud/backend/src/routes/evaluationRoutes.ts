import { Router } from 'express';
import { evaluateConversation, getEvaluation } from '../controllers/evaluationController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Evaluate a conversation
router.post('/:id/evaluate', optionalAuth, evaluateConversation);

// Get existing evaluation
router.get('/:id/evaluation', optionalAuth, getEvaluation);

export default router;