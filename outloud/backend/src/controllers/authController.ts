import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { supabase } from '../services/supabase';
import { AppError } from '../middleware/errorHandler';
import { User, JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET!;

// Helper: Generate JWT token
const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

const generateRandomId = () => {
  return randomBytes(4).toString('hex'); // 8 character hex string
};

// Helper: Format user response (remove password_hash)
const formatUserResponse = (user: User) => {
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// POST /auth/signup
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      throw new AppError('Username already taken', 400);
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        username,
        password_hash,
        is_guest: false,
      })
      .select()
      .single();

    if (error) throw error;

    // Generate token
    const token = generateToken({
      userId: newUser.id,
      username: newUser.username,
      isGuest: false,
    });

    res.status(201).json({
      token,
      user: formatUserResponse(newUser),
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      throw new AppError('Invalid username or password', 401);
    }

    // Check if user is guest (guests don't have passwords)
    if (user.is_guest) {
      throw new AppError('Guest users cannot log in with password', 400);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash!);

    if (!isValidPassword) {
      throw new AppError('Invalid username or password', 401);
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      isGuest: false,
    });

    res.json({
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/guest
export const createGuestUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Create guest user with random username
    const guestUsername = `guest_${generateRandomId().slice(0, 8)}`;

    const { data: guestUser, error } = await supabase
      .from('users')
      .insert({
        username: guestUsername,
        is_guest: true,
        password_hash: null,
      })
      .select()
      .single();

    if (error) throw error;

    // Generate token
    const token = generateToken({
      userId: guestUser.id,
      username: guestUser.username,
      isGuest: true,
    });

    res.status(201).json({
      token,
      user: formatUserResponse(guestUser),
    });
  } catch (error) {
    next(error);
  }
};

// GET /auth/me
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};