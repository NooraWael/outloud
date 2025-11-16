import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '@/components/ui/NeumorphicCard';
import Button from '@/components/ui/Button';
import { colors, typography } from '@/styles/neumorphic';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '@/services/core';
import { DemoTopic } from '@/services/types';

const LAST_PROJECT = {
  id: 'os-exam',
  title: 'OS Exam – Deadlocks',
  persona: 'Mentor pushback',
  nextStep: 'Continue from turn 3',
  materials: 3,
};

const PERSONAS = [
  { id: 'mentor', label: 'Mentor', icon: 'school-outline' as const },
  { id: 'buddy', label: 'Study Buddy', icon: 'people-outline' as const },
  { id: 'coach', label: 'Coach', icon: 'barbell-outline' as const },
  { id: 'critic', label: 'Critic', icon: 'shield-outline' as const },
];

// Icon mapping for topics
const TOPIC_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Operating Systems': 'hardware-chip-outline',
  'Photosynthesis': 'leaf-outline',
  'IELTS Speaking': 'mic-outline',
  'Startup Pitch': 'rocket-outline',
};

// Color mapping for personas
const PERSONA_COLORS: Record<string, string> = {
  mentor: colors.primary,
  critic: colors.coral,
  buddy: '#FFE66D',
  coach: '#9b59b6',
};

// Default icon if not found
const DEFAULT_ICON: keyof typeof Ionicons.glyphMap = 'book-outline';

export default function TopicsScreen() {
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0].id);
  const [topics, setTopics] = useState<DemoTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTopics();
  }, []);

  async function loadTopics() {
    try {
      setLoading(true);
      const response = await api.demo.getTopics();
      setTopics(response.topics);
    } catch (err: any) {
      setError(err.message || 'Failed to load topics');
      console.error('Error loading topics:', err);
    } finally {
      setLoading(false);
    }
  }

  // Get icon based on topic title (match keywords)
  function getTopicIcon(title: string): keyof typeof Ionicons.glyphMap {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('operating') || titleLower.includes('deadlock')) {
      return 'hardware-chip-outline';
    }
    if (titleLower.includes('photosynthesis') || titleLower.includes('biology')) {
      return 'leaf-outline';
    }
    if (titleLower.includes('ielts') || titleLower.includes('speaking')) {
      return 'mic-outline';
    }
    if (titleLower.includes('startup') || titleLower.includes('pitch')) {
      return 'rocket-outline';
    }
    if (titleLower.includes('exam') || titleLower.includes('oral')) {
      return 'chatbubble-ellipses-outline';
    }
    if (titleLower.includes('capstone') || titleLower.includes('demo')) {
      return 'color-wand-outline';
    }
    
    return DEFAULT_ICON;
  }

  // Get color based on persona
  function getTopicColor(persona: string): string {
    return PERSONA_COLORS[persona] || colors.primary;
  }

  async function handleTopicPress(topicId: string, persona: string) {
    try {
      // Create a new conversation for this topic
      const { conversation } = await api.conversations.create({
        topic_id: topicId,
        persona: persona as 'mentor' | 'critic' | 'buddy' | 'coach',
      });
      
      // Navigate to the conversation
      router.push(`/conversation/${conversation.id}`);
    } catch (err: any) {
      console.error('Error creating conversation:', err);
      // Optionally show an error toast/alert
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Study spaces</Text>
          <Text style={styles.headerTitle}>Welcome back.</Text>
          <Text style={styles.headerSubtitle}>
            Resume your last project or spin up a fresh conversation.
          </Text>
        </View>

        <GlassCard style={styles.continueCard}>
          <Text style={styles.sectionLabel}>Continue project</Text>
          <Text style={styles.continueTitle}>{LAST_PROJECT.title}</Text>
          <Text style={styles.continueMeta}>
            {LAST_PROJECT.persona} • {LAST_PROJECT.nextStep}
          </Text>
          <View style={styles.continueStats}>
            <View style={styles.continueStatBox}>
              <Text style={styles.continueStatValue}>{LAST_PROJECT.materials}</Text>
              <Text style={styles.continueStatLabel}>Materials</Text>
            </View>
            <Button
              title="Continue session"
              onPress={() => router.push(`/conversation/${LAST_PROJECT.id}`)}
            />
          </View>
        </GlassCard>

        <GlassCard style={styles.newConversationCard}>
          <Text style={styles.sectionLabel}>Start new conversation</Text>
          <Text style={styles.sectionSubtitle}>
            Pick a persona vibe, add docs, and link to a project.
          </Text>

          <View style={styles.personaRow}>
            {PERSONAS.map((persona) => (
              <Pressable
                key={persona.id}
                style={[
                  styles.personaChip,
                  selectedPersona === persona.id && styles.personaChipActive,
                ]}
                onPress={() => setSelectedPersona(persona.id)}
              >
                <Ionicons
                  name={persona.icon}
                  size={20}
                  color={
                    selectedPersona === persona.id
                      ? colors.background
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.personaLabel,
                    selectedPersona === persona.id && styles.personaLabelActive,
                  ]}
                >
                  {persona.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.uploadArea}>
            <Ionicons name="cloud-upload-outline" size={24} color={colors.textSecondary} />
            <Text style={styles.uploadText}>Drop study guides, slides, or rubric PDFs</Text>
            <Text style={styles.uploadHint}>
              Optional • keeps the AI grounded in your source
            </Text>
          </View>

          <View style={styles.projectLinkArea}>
            <View style={styles.blurOverlay} />
            <View style={styles.projectLinkContent}>
              <Ionicons name="link-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.projectLinkText}>
                Link to a project space (coming soon)
              </Text>
            </View>
          </View>

          <Button title="Start recording" onPress={() => router.push('/conversation/new')} />
        </GlassCard>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>Need inspiration?</Text>
          <Text style={styles.sectionHint}>Pick any topic to auto-fill your prompt.</Text>
        </View>

        {/* Loading state */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading topics...</Text>
          </View>
        )}

        {/* Error state */}
        {error && !loading && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={32} color={colors.coral} />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={loadTopics} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* Topics grid */}
        {!loading && !error && topics.length > 0 && (
          <View style={styles.grid}>
            {topics.map((topic) => {
              const icon = getTopicIcon(topic.title);
              const accentColor = getTopicColor(topic.persona);

              return (
                <Pressable
                  key={topic.id}
                  style={[styles.topicCard, styles.shadow]}
                  onPress={() => handleTopicPress(topic.id, topic.persona)}
                >
                  <View style={[styles.iconWrap, { borderColor: `${accentColor}33` }]}>
                    <Ionicons name={icon} size={24} color={accentColor} />
                  </View>
                  <Text style={styles.cardTitle}>{topic.title}</Text>
                  <Text style={styles.cardDescription}>{topic.description}</Text>
                  
                  {/* Persona badge */}
                  <View style={styles.personaBadge}>
                    <View
                      style={[styles.personaDot, { backgroundColor: accentColor }]}
                    />
                    <Text style={styles.personaBadgeText}>
                      {topic.persona.charAt(0).toUpperCase() + topic.persona.slice(1)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Empty state */}
        {!loading && !error && topics.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No topics available yet</Text>
            <Text style={styles.emptyHint}>Check back soon for study topics!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingTop: 16,
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 60,
    paddingHorizontal: 24,
    gap: 20,
  },
  header: {
    gap: 8,
  },
  headerLabel: {
    ...typography.label,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 34,
  },
  headerSubtitle: {
    ...typography.body,
    maxWidth: 320,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: 8,
  },
  sectionSubtitle: {
    ...typography.body,
    fontSize: 14,
    marginBottom: 16,
  },
  continueCard: {
    gap: 12,
  },
  continueTitle: {
    ...typography.h2,
    fontSize: 24,
  },
  continueMeta: {
    ...typography.body,
    fontSize: 14,
  },
  continueStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  continueStatBox: {
    width: 92,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
  },
  continueStatValue: {
    ...typography.h2,
    fontSize: 20,
  },
  continueStatLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  newConversationCard: {
    gap: 16,
  },
  personaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  personaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  personaChipActive: {
    backgroundColor: colors.primary,
    borderColor: 'transparent',
  },
  personaLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  personaLabelActive: {
    color: colors.background,
  },
  uploadArea: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderStyle: 'dashed',
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  uploadText: {
    ...typography.h3,
    fontSize: 15,
  },
  uploadHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  projectLinkArea: {
    borderRadius: 18,
    backgroundColor: colors.backgroundSecondary,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  projectLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectLinkText: {
    ...typography.body,
    fontSize: 14,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 8, 18, 0.7)',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    ...typography.body,
    color: colors.coral,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  retryText: {
    ...typography.label,
    color: colors.primary,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    ...typography.h3,
    fontSize: 18,
  },
  emptyHint: {
    ...typography.body,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  topicCard: {
    width: '48%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 8,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050c18',
    marginBottom: 8,
  },
  cardTitle: {
    ...typography.h3,
    fontSize: 18,
    marginBottom: 4,
  },
  cardDescription: {
    ...typography.body,
    fontSize: 13,
    marginBottom: 8,
  },
  personaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  personaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  personaBadgeText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
});