import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase';
import { evaluateExplanation } from '../services/evaluationService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// POST /conversations/:id/evaluate
export const evaluateConversation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: conversationId } = req.params;

    // 1. Get conversation details
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select(`
        *,
        demo_topics (
          id,
          title,
          material_text
        )
      `)
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      throw new AppError('Conversation not found', 404);
    }

    // 2. Check if already evaluated
    const { data: existingEval } = await supabase
      .from('evaluations')
      .select('id')
      .eq('conversation_id', conversationId)
      .single();

    if (existingEval) {
      throw new AppError('Conversation already evaluated', 400);
    }

    // 3. Get all user messages and combine into transcript
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('text')
      .eq('conversation_id', conversationId)
      .eq('sender', 'user')
      .order('created_at', { ascending: true });

    if (msgError) throw msgError;

    if (!messages || messages.length === 0) {
      throw new AppError('No user messages to evaluate', 400);
    }

    const userTranscript = messages.map(m => m.text).join(' ');

    // 4. Evaluate using OpenAI
    const evaluation = await evaluateExplanation({
      userTranscript,
      materialText: conversation.demo_topics?.material_text,
      topicTitle: conversation.demo_topics?.title || 'this topic',
    });

    // 5. Save evaluation to database
    const { data: savedEval, error: evalError } = await supabase
      .from('evaluations')
      .insert({
        conversation_id: conversationId,
        scores: evaluation.scores,
        heatmap: evaluation.heatmap,
        summary: evaluation.summary,
        retell_prompt: evaluation.retell_prompt,
      })
      .select()
      .single();

    if (evalError) throw evalError;

    // 6. Update conversation status
    await supabase
      .from('conversations')
      .update({ status: 'evaluated' })
      .eq('id', conversationId);

    // 7. Return evaluation
    res.json({
      evaluation: savedEval,
    });
  } catch (error) {
    next(error);
  }
};

// GET /conversations/:id/evaluation (get existing evaluation)
export const getEvaluation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: conversationId } = req.params;

    const { data: evaluation, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !evaluation) {
      throw new AppError('Evaluation not found', 404);
    }

    res.json({ evaluation });
  } catch (error) {
    next(error);
  }
};