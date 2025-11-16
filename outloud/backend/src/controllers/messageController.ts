import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import { supabase } from '../services/supabase';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const STT_SERVICE_URL = process.env.STT_SERVICE_URL || 'http://localhost:8000';

// POST /conversations/:id/voice-message
export const sendVoiceMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: conversationId } = req.params;
    const audioFile = (req as any).file; // From multer middleware

    if (!audioFile) {
      throw new AppError('Audio file is required', 400);
    }

    // 1. Get conversation details
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*, demo_topics (*)')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      throw new AppError('Conversation not found', 404);
    }

    // 2. Check turn limit
    if (conversation.turn_count >= 3) {
      throw new AppError('Conversation has reached maximum turns (3)', 403);
    }

    // 3. Upload user audio to Supabase Storage
    const userAudioPath = `user_audio/${conversationId}/${Date.now()}_${audioFile.originalname}`;
    const { error: uploadError } = await supabase.storage
      .from('user-audio')
      .upload(userAudioPath, audioFile.buffer, {
        contentType: audioFile.mimetype,
      });

    if (uploadError) throw uploadError;

    const { data: userAudioUrl } = supabase.storage
      .from('user-audio')
      .getPublicUrl(userAudioPath);

    // 4. Transcribe audio using STT service
    const formData = new FormData();
    formData.append('file', audioFile.buffer, audioFile.originalname);

    const sttResponse = await axios.post(
      `${STT_SERVICE_URL}/stt/transcribe`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const transcript = sttResponse.data.transcript;

    if (!transcript) {
      throw new AppError('Failed to transcribe audio', 500);
    }

    // 5. Save user message
    const { data: userMessage, error: userMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender: 'user',
        text: transcript,
        audio_url: userAudioUrl.publicUrl,
      })
      .select()
      .single();

    if (userMsgError) throw userMsgError;

    // 6. Get conversation history for context
    const { data: previousMessages } = await supabase
      .from('messages')
      .select('sender, text')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    // 7. Generate AI response (TODO: Implement OpenAI call)
    // For now, return a placeholder
    const aiResponseText = `[AI ${conversation.persona} response to: "${transcript}"]`;

    // 8. Save AI message (without TTS for now)
    const { data: aiMessage, error: aiMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender: 'ai',
        text: aiResponseText,
        audio_url: null, // TODO: Generate TTS
      })
      .select()
      .single();

    if (aiMsgError) throw aiMsgError;

    // 9. Update conversation turn count
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        turn_count: conversation.turn_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    if (updateError) throw updateError;

    // 10. Return both messages
    res.json({
      userMessage,
      aiMessage,
      turn_count: conversation.turn_count + 1,
      can_continue: conversation.turn_count + 1 < 3,
    });
  } catch (error) {
    next(error);
  }
};