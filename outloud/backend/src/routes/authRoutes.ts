import { Router } from 'express';
import { signup, login, createGuestUser, getCurrentUser } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validate, schemas } from '../utils/validation';

const router = Router();

// Public routes
router.post('/signup', validate(schemas.signup), signup);
router.post('/login', validate(schemas.login), login);
router.post('/guest', createGuestUser);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

export default router;