import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  RecordingPresets,
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioPlayer,
} from 'expo-audio';

import Button from '@/components/ui/Button';
import { colors, typography } from '@/styles/neumorphic';
import SpeechBubble from '@/components/conversation/SpeechBubble';
import ScoreCard from '@/components/ui/ScoreCard';
import Heatmap from '@/components/ui/HeatMap';

import { api } from '@/services/core';
import { ConversationDetailResponse, Message } from '@/services/types';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const player = useAudioPlayer();

  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState<ConversationDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentlyPlayingUrl, setCurrentlyPlayingUrl] = useState<string | null>(null);

  const [isEvaluating, setIsEvaluating] = useState(false);

  // Load conversation data
  useEffect(() => {
    loadConversation();
  }, [id]);

  async function loadConversation() {
    if (!id) return;

    try {
      setLoading(true);
      const data = await api.conversations.getById(id);
      setConversation(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversation');
    } finally {
      setLoading(false);
    }
  }

  async function handleEndSession() {
    router.back();
  }

  async function ensureAudioPermission() {
    const permissionStatus = await getRecordingPermissionsAsync();
    if (permissionStatus.granted) return true;

    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Microphone permission required',
        'Please allow microphone access to send a voice response.'
      );
      return false;
    }

    return true;
  }

  async function playAIAudio(audioUrl: string) {
    try {
      // Set audio mode for playback
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
        shouldPlayInBackground: true,
      });

      // Replace the source and play
      player.replace(audioUrl);
      player.play();
      setCurrentlyPlayingUrl(audioUrl);
    } catch (err) {
      console.error('Failed to play AI audio:', err);
    }
  }

  async function evaluateConversation() {
    if (!id) return;

    try {
      setIsEvaluating(true);
      const { evaluation } = await api.evaluations.evaluate(id);

      // Update conversation with evaluation
      setConversation((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          conversation: {
            ...prev.conversation,
            status: 'evaluated',
          },
          latestEvaluation: evaluation,
        };
      });
    } catch (err: any) {
      console.error('Failed to evaluate:', err);
      Alert.alert('Evaluation failed', err.message || 'Unable to evaluate your conversation.');
    } finally {
      setIsEvaluating(false);
    }
  }

  async function handleRecordPress() {
    if (!id || isSending) return;

    // Starting a new recording
    if (!isRecording) {
      const hasPermission = await ensureAudioPermission();
      if (!hasPermission) return;

      try {
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          interruptionMode: 'doNotMix',
          interruptionModeAndroid: 'doNotMix',
          shouldRouteThroughEarpiece: false,
        });

        await recorder.prepareToRecordAsync();
        recorder.record();
        setIsRecording(true);
      } catch (err: any) {
        console.error('Failed to start recording', err);
        Alert.alert('Unable to start', err.message || 'Something went wrong while recording.');
      }
      return;
    }

    // Stopping current recording and sending to backend
    try {
      setIsSending(true);
      await recorder.stop();
      const recordingStatus = recorder.getStatus();
      const uri = recorder.uri ?? recordingStatus.url;

      if (!uri) {
        throw new Error('Recording file is not available');
      }

      console.log('Recorded audio URI:', uri);
      
      const response = await api.messages.sendVoiceMessage(id, uri);

      // Update conversation state with new messages
      setConversation((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          conversation: {
            ...prev.conversation,
            turn_count: response.turn_count,
          },
          messages: [...prev.messages, response.userMessage, response.aiMessage],
        };
      });

      // Play AI audio response if available
      if (response.aiMessage.audio_url) {
        await playAIAudio(response.aiMessage.audio_url);
      }

      // If we've reached 3 turns, auto-evaluate
      if (response.turn_count >= 3) {
        // Wait a moment for audio to finish playing (or just start eval)
        setTimeout(() => {
          evaluateConversation();
        }, 1000);
      }

    } catch (err: any) {
      console.error('Failed to send voice message', err);
      Alert.alert('Send failed', err.message || 'Unable to send your voice message right now.');
    } finally {
      setIsSending(false);
      setIsRecording(false);
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        recorder.stop().catch(() => undefined);
      }
      if (player.playing) {
        player.pause();
      }
    };
  }, [isRecording, recorder, player]);

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !conversation) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.container, styles.centerContent]}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.coral} />
          <Text style={styles.errorText}>{error || 'Conversation not found'}</Text>
          <Button title="Go Back" onPress={handleEndSession} />
        </View>
      </SafeAreaView>
    );
  }

  const { conversation: conv, messages, latestEvaluation } = conversation;
  const isEvaluated = conv.status === 'evaluated';
  
  const primaryActionLabel = isSending
    ? 'Sending voice response...'
    : isRecording
    ? 'Tap to stop & send'
    : 'Tap to start speaking';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>
            {isEvaluated ? 'Session Complete' : 'Now speaking in'}
          </Text>
          <Text style={styles.headerTitle}>
            {conv.demo_topics?.title || 'Conversation'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isEvaluated
              ? `Evaluated • ${conv.turn_count}/3 turns used`
              : `${conv.turn_count}/3 turns • ${conv.persona} mode`}
          </Text>
        </View>

        {/* Evaluating state */}
        {isEvaluating && (
          <View style={styles.evaluatingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.evaluatingText}>Evaluating your explanation...</Text>
            <Text style={styles.evaluatingHint}>
              Analyzing coverage, clarity, correctness, and causality
            </Text>
          </View>
        )}

        {/* Show evaluation if exists */}
        {isEvaluated && latestEvaluation ? (
          <View style={styles.evaluationSection}>
            {/* Scores */}
            <ScoreCard scores={latestEvaluation.scores} />

            {/* Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <Text style={styles.summaryText}>{latestEvaluation.summary}</Text>
            </View>

            {/* Heatmap */}
            <View style={styles.heatmapCard}>
              <Heatmap segments={latestEvaluation.heatmap} />
            </View>

            {/* Retell Prompt */}
            <View style={styles.retellCard}>
              <Text style={styles.retellTitle}>Next Challenge</Text>
              <Text style={styles.retellText}>{latestEvaluation.retell_prompt}</Text>
            </View>
          </View>
        ) : (
          /* Active conversation UI */
          !isEvaluating && (
            <View style={styles.activeSection}>
              <View style={styles.bubbleSection}>
                <SpeechBubble />
                <Text style={styles.bubbleHint}>
                  {player.playing
                    ? '🔊 AI is speaking...'
                    : 'Listening pulse • tap when you want to speak'}
                </Text>
              </View>

              {/* Messages */}
              {messages.length > 0 && (
                <View style={styles.messagesSection}>
                  <Text style={styles.messagesTitle}>Conversation History</Text>
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      onPlayAudio={msg.sender === 'ai' && msg.audio_url ? () => playAIAudio(msg.audio_url!) : undefined}
                      isPlaying={player.playing && currentlyPlayingUrl === msg.audio_url}
                    />
                  ))}
                </View>
              )}
            </View>
          )
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {!isEvaluated && conv.turn_count < 3 ? (
            <>
              <Button
                title={primaryActionLabel}
                onPress={handleRecordPress}
                disabled={isSending || isEvaluating}
              />
              <Button title="End session" variant="ghost" onPress={handleEndSession} />
            </>
          ) : isEvaluated ? (
            <Button title="Back to Topics" onPress={handleEndSession} />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Message bubble component
function MessageBubble({
  message,
  onPlayAudio,
  isPlaying,
}: {
  message: Message;
  onPlayAudio?: () => void;
  isPlaying?: boolean;
}) {
  const isUser = message.sender === 'user';
  
  return (
    <View
      style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <View style={styles.messageHeader}>
        <Text style={styles.messageSender}>
          {isUser ? 'You' : 'AI'}
        </Text>
        {onPlayAudio && (
          <Ionicons
            name={isPlaying ? 'volume-high' : 'play-circle-outline'}
            size={20}
            color={colors.primary}
            onPress={onPlayAudio}
          />
        )}
      </View>
      <Text style={styles.messageText}>{message.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  errorText: {
    ...typography.body,
    color: colors.coral,
    textAlign: 'center',
  },
  header: {
    paddingTop: 32,
    gap: 8,
    marginBottom: 32,
  },
  headerLabel: {
    ...typography.label,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 28,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  evaluatingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  evaluatingText: {
    ...typography.h3,
    fontSize: 18,
  },
  evaluatingHint: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activeSection: {
    gap: 32,
  },
  bubbleSection: {
    alignItems: 'center',
    gap: 20,
    paddingVertical: 32,
  },
  bubbleHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  messagesSection: {
    gap: 12,
  },
  messagesTitle: {
    ...typography.label,
    marginBottom: 8,
  },
  messageBubble: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userBubble: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.2)',
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageSender: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  messageText: {
    ...typography.body,
    fontSize: 14,
  },
  evaluationSection: {
    gap: 24,
    marginBottom: 32,
  },
  summaryCard: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  summaryTitle: {
    ...typography.h3,
    fontSize: 16,
  },
  summaryText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  heatmapCard: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 300,
  },
  retellCard: {
    padding: 20,
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.2)',
    gap: 12,
  },
  retellTitle: {
    ...typography.h3,
    fontSize: 16,
    color: '#9b59b6',
  },
  retellText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  actions: {
    gap: 12,
    marginTop: 32,
  },
});