import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase';
import { AppError } from '../middleware/errorHandler';

// GET /demo/topics
export const getDemoTopics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data: topics, error } = await supabase
      .from('demo_topics')
      .select('id, title, description, persona, created_at')
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json({
      topics: topics || [],
      count: topics?.length || 0,
    });
  } catch (error) {
    next(error);
  }
};

// GET /demo/topics/:id
export const getDemoTopicById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { data: topic, error } = await supabase
      .from('demo_topics')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !topic) {
      throw new AppError('Topic not found', 404);
    }

    res.json({ topic });
  } catch (error) {
    next(error);
  }
};