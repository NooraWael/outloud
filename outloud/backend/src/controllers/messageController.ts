import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import { supabase } from '../services/supabase';
import { generateAIReply, generateTTS } from '../services/openaiService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const STT_SERVICE_URL = process.env.STT_SERVICE_URL || 'http://10.10.4.13:8000';

// POST /conversations/:id/voice-message
export const sendVoiceMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: conversationId } = req.params;
    const audioFile = (req as any).file;

    if (!audioFile) {
      throw new AppError('Audio file is required', 400);
    }

    // 1. Get conversation details with topic material
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
        timeout: 30000, // 30 second timeout
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
      .order('created_at', { ascending: true })
      .limit(10); // Last 10 messages for context

    // 7. Generate AI response using OpenAI
    const aiResponseText = await generateAIReply({
      persona: conversation.persona,
      userMessage: transcript,
      conversationHistory: previousMessages || [],
      materialText: conversation.demo_topics?.material_text,
      topicTitle: conversation.demo_topics?.title || 'this topic',
    });

    // 8. Generate TTS for AI response
    const ttsBuffer = await generateTTS(aiResponseText);
    
    const aiAudioPath = `ai_audio/${conversationId}/${Date.now()}.mp3`;
    const { error: ttsUploadError } = await supabase.storage
      .from('ai-audio')
      .upload(aiAudioPath, ttsBuffer, {
        contentType: 'audio/mpeg',
      });

    if (ttsUploadError) throw ttsUploadError;

    const { data: aiAudioUrl } = supabase.storage
      .from('ai-audio')
      .getPublicUrl(aiAudioPath);

    // 9. Save AI message
    const { data: aiMessage, error: aiMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender: 'ai',
        text: aiResponseText,
        audio_url: aiAudioUrl.publicUrl,
      })
      .select()
      .single();

    if (aiMsgError) throw aiMsgError;

    // 10. Update conversation turn count
    const newTurnCount = conversation.turn_count + 1;
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        turn_count: newTurnCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    if (updateError) throw updateError;

    // 11. Return both messages
    res.json({
      userMessage,
      aiMessage,
      turn_count: newTurnCount,
      can_continue: newTurnCount < 3,
    });
  } catch (error) {
    // Handle specific errors
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        return next(new AppError('STT service is unavailable', 503));
      }
    }
    next(error);
  }
};