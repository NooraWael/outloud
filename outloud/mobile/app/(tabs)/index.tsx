import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '@/components/ui/NeumorphicCard';
import Button from '@/components/ui/Button';
import { colors, typography } from '@/styles/neumorphic';
import { SafeAreaView } from 'react-native-safe-area-context';

const LAST_PROJECT = {
  id: 'os-exam',
  title: 'OS Exam – Deadlocks',
  persona: 'Mentor pushback',
  nextStep: 'Continue from turn 3',
  materials: 3,
};

const PERSONAS = [
  { id: 'mentor', label: 'Mentor', icon: 'school-outline' as const },
  { id: 'peer', label: 'Study Buddy', icon: 'people-outline' as const },
  { id: 'coach', label: 'Coach', icon: 'barbell-outline' as const },
  { id: 'critic', label: 'Critic', icon: 'shield-outline' as const },
];

const TOPICS = [
  {
    id: '1',
    title: 'Operating Systems',
    description: 'Deadlocks, scheduling, race conditions.',
    icon: 'hardware-chip-outline' as const,
    accent: colors.primary,
  },
  {
    id: '2',
    title: 'IELTS Speaking',
    description: 'Structure answers with confident pacing.',
    icon: 'mic-outline' as const,
    accent: colors.coral,
  },
  {
    id: '3',
    title: 'Startup Pitch',
    description: 'Value prop, hook, and story arc.',
    icon: 'rocket-outline' as const,
    accent: colors.accent,
  },
  {
    id: '4',
    title: 'Photosynthesis',
    description: 'Light reactions + Calvin cycle.',
    icon: 'leaf-outline' as const,
    accent: '#7C83FD',
  },
  {
    id: '5',
    title: 'Oral Exam Prep',
    description: 'Defend your thesis without blanking.',
    icon: 'chatbubble-ellipses-outline' as const,
    accent: '#9B5DE5',
  },
  {
    id: '6',
    title: 'Capstone Demo',
    description: 'Tell the story from problem to solution.',
    icon: 'color-wand-outline' as const,
    accent: '#4ECDC4',
  },
];

export default function TopicsScreen() {
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0].id);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}  >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Study spaces</Text>
        <Text style={styles.headerTitle}>Welcome back.</Text>
        <Text style={styles.headerSubtitle}>Resume your last project or spin up a fresh conversation.</Text>
      </View>

      <GlassCard style={styles.continueCard}>
        <Text style={styles.sectionLabel}>Continue project</Text>
        <Text style={styles.continueTitle}>{LAST_PROJECT.title}</Text>
        <Text style={styles.continueMeta}>{LAST_PROJECT.persona} • {LAST_PROJECT.nextStep}</Text>
        <View style={styles.continueStats}>
          <View style={styles.continueStatBox}>
            <Text style={styles.continueStatValue}>{LAST_PROJECT.materials}</Text>
            <Text style={styles.continueStatLabel}>Materials</Text>
          </View>
          <Button title="Continue session" onPress={() => router.push(`/conversation/${LAST_PROJECT.id}`)} />
        </View>
      </GlassCard>

      <GlassCard style={styles.newConversationCard}>
        <Text style={styles.sectionLabel}>Start new conversation</Text>
        <Text style={styles.sectionSubtitle}>Pick a persona vibe, add docs, and link to a project.</Text>

        <View style={styles.personaRow}>
          {PERSONAS.map((persona) => (
            <Pressable
              key={persona.id}
              style={[styles.personaChip, selectedPersona === persona.id && styles.personaChipActive]}
              onPress={() => setSelectedPersona(persona.id)}
            >
              <Ionicons
                name={persona.icon}
                size={20}
                color={selectedPersona === persona.id ? colors.background : colors.textSecondary}
              />
              <Text
                style={[styles.personaLabel, selectedPersona === persona.id && styles.personaLabelActive]}
              >
                {persona.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.uploadArea}>
          <Ionicons name="cloud-upload-outline" size={24} color={colors.textSecondary} />
          <Text style={styles.uploadText}>Drop study guides, slides, or rubric PDFs</Text>
          <Text style={styles.uploadHint}>Optional • keeps the AI grounded in your source</Text>
        </View>

        <View style={styles.projectLinkArea}>
          <View style={styles.blurOverlay} />
          <View style={styles.projectLinkContent}>
            <Ionicons name="link-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.projectLinkText}>Link to a project space (coming soon)</Text>
          </View>
        </View>

        <Button title="Start recording" onPress={() => router.push('/conversation/new')} />
      </GlassCard>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionLabel}>Need inspiration?</Text>
        <Text style={styles.sectionHint}>Pick any topic to auto-fill your prompt.</Text>
      </View>

      <View style={styles.grid}>
        {TOPICS.map((topic) => (
          <Pressable
            key={topic.id}
            style={[styles.topicCard, styles.shadow]}
            onPress={() => router.push(`/conversation/${topic.id}`)}
          >
            <View style={[styles.iconWrap, { borderColor: `${topic.accent}33` }] }>
              <Ionicons name={topic.icon} size={24} color={topic.accent} />
            </View>
            <Text style={styles.cardTitle}>{topic.title}</Text>
            <Text style={styles.cardDescription}>{topic.description}</Text>
          </Pressable>
        ))}
      </View>
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
    marginBottom: 14,
  },
  cardTitle: {
    ...typography.h3,
    fontSize: 18,
    marginBottom: 6,
  },
  cardDescription: {
    ...typography.body,
    fontSize: 13,
  },
});
