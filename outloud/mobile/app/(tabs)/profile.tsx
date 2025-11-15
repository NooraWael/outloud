import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlassCard from '@/components/ui/NeumorphicCard';
import { colors, typography } from '@/styles/neumorphic';

const USER = {
  name: 'Noora Wael',
  handle: '@nooni.codes',
  major: 'CS + HCI',
  semesters: 'Fall 24 cohort',
  conversations: 18,
  studySpaces: 5,
  uploads: 12,
};

const PROJECTS = [
  {
    id: 'os',
    title: 'OS Exam – Deadlocks',
    persona: 'Mentor pushback',
    conversations: 8,
    uploads: 3,
    lastActive: '2 days ago',
  },
  {
    id: 'ielts',
    title: 'IELTS Speaking – Band 8',
    persona: 'Coach energy',
    conversations: 5,
    uploads: 4,
    lastActive: 'Yesterday',
  },
  {
    id: 'pitch',
    title: 'Hackathon Pitch',
    persona: 'Critic sparring',
    conversations: 3,
    uploads: 5,
    lastActive: '3 hours ago',
  },
];

const MATERIALS = [
  { id: '1', name: 'Deadlocks cheat sheet.pdf', project: 'OS Exam', size: '1.2 MB' },
  { id: '2', name: 'IELTS follow-up prompts.docx', project: 'IELTS Speaking', size: '640 KB' },
  { id: '3', name: 'Pitch storyboard.fig', project: 'Hackathon Pitch', size: '3.4 MB' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={[ 'left', 'right']}  >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <GlassCard style={styles.heroCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>
              {USER.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </Text>
          </View>
          <Text style={styles.name}>{USER.name}</Text>
          <Text style={styles.handle}>{USER.handle}</Text>
          <Text style={styles.meta}>
            {USER.major} • {USER.semesters}
          </Text>

          <View style={styles.statsRow}>
            <StatBlock label="Conversations" value={USER.conversations} />
            <StatBlock label="Study spaces" value={USER.studySpaces} />
            <StatBlock label="Uploads" value={USER.uploads} />
          </View>
        </GlassCard>

        <View style={styles.masteryCard}>
          <View style={styles.masteryIcon}>
            <Ionicons name="shield-checkmark-outline" size={28} color={colors.primary} />
          </View>
          <View style={styles.masteryText}>
            <Text style={styles.masteryLabel}>Mastered topic</Text>
            <Text style={styles.masteryTitle}>Deadlock protocols</Text>
            <Text style={styles.masteryMeta}>Clarity score 92 • Retell streak ×4</Text>
          </View>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Active projects</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.projectRow}
          >
            {PROJECTS.map((project) => (
              <View key={project.id} style={styles.projectPill}>
                <View style={styles.projectPillIcon}>
                  <Ionicons name="mic-outline" size={18} color={colors.primary} />
                </View>
                <Text style={styles.projectPillTitle}>{project.title}</Text>
                <Text style={styles.projectPillMeta}>
                  {project.conversations} convos • {project.uploads} uploads
                </Text>
                <Text style={styles.projectPillPersona}>{project.persona}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.sectionLabel}>Recent material uploads</Text>
        <GlassCard style={styles.materialCard}>
          {MATERIALS.map((material, index) => (
            <View key={material.id} style={styles.materialRow}>
              <View style={styles.materialIcon}>
                <Ionicons name="document-text-outline" size={18} color={colors.accent} />
              </View>
              <View style={styles.materialText}>
                <Text style={styles.materialName}>{material.name}</Text>
                <Text style={styles.materialProject}>
                  {material.project} • {material.size}
                </Text>
              </View>
              {index < MATERIALS.length - 1 && <View style={styles.materialDivider} />}
            </View>
          ))}
        </GlassCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Outloud Beta • Make learning feel like a co-hosted podcast</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingRight: 24,
    paddingLeft: 24,
    paddingBottom: 60,
    gap: 20,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarInitials: {
    ...typography.h2,
    fontSize: 28,
  },
  name: {
    ...typography.h2,
    fontSize: 26,
  },
  handle: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  meta: {
    ...typography.body,
    fontSize: 13,
    marginBottom: 24,
  },
  statsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sectionLabel: {
    ...typography.label,
    marginTop: 4,
  },
  masteryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    backgroundColor: '#0b162c',
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  masteryIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  masteryText: {
    flex: 1,
  },
  masteryLabel: {
    ...typography.label,
    marginBottom: 4,
  },
  masteryTitle: {
    ...typography.h2,
    fontSize: 22,
  },
  masteryMeta: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  projectRow: {
    gap: 12,
    paddingVertical: 4,
  },
  projectPill: {
    width: 220,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  projectPillIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#060d1b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  projectPillTitle: {
    ...typography.h3,
    marginBottom: 6,
  },
  projectPillMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  projectPillPersona: {
    ...typography.body,
    fontSize: 13,
  },
  materialCard: {
    gap: 12,
    paddingVertical: 16,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  materialIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  materialText: {
    flex: 1,
  },
  materialName: {
    ...typography.h3,
    fontSize: 15,
  },
  materialProject: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  materialDivider: {
    position: 'absolute',
    bottom: 0,
    left: 48,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.glassBorder,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  footerText: {
    ...typography.caption,
    textAlign: 'center',
  },
});
