import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// POST /conversations
export const createConversation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { topic_id, persona } = req.body;
    const userId = req.user?.userId || null; // Allow guests

    // Verify topic exists
    const { data: topic, error: topicError } = await supabase
      .from('demo_topics')
      .select('id')
      .eq('id', topic_id)
      .single();

    if (topicError || !topic) {
      throw new AppError('Topic not found', 404);
    }

    // Create conversation
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        topic_id,
        persona,
        turn_count: 0,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ conversation });
  } catch (error) {
    next(error);
  }
};

// GET /conversations/:id
export const getConversation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Get conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single();

    if (convError || !conversation) {
      throw new AppError('Conversation not found', 404);
    }

    // Optional: Check ownership if user_id is set 
    if (conversation.user_id && conversation.user_id !== userId) {
      throw new AppError('Access denied', 403);
    }

    // Get messages
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (msgError) throw msgError;

    // Get latest evaluation (if any)
    const { data: evaluation } = await supabase
      .from('evaluations')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    res.json({
      conversation,
      messages: messages || [],
      latestEvaluation: evaluation || null,
    });
  } catch (error) {
    next(error);
  }
};

// GET /conversations (list user's conversations)
export const getUserConversations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('User ID required', 401);
    }

    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        demo_topics (
          id,
          title,
          description
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    res.json({
      conversations: conversations || [],
      count: conversations?.length || 0,
    });
  } catch (error) {
    next(error);
  }
};