import { StyleSheet, View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui/Button';
import { colors, typography } from '@/styles/neumorphic';
import SpeechBubble from '@/components/conversation/SpeechBubble';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Now speaking in</Text>
          <Text style={styles.headerTitle}>{id || 'New Session'}</Text>
          <Text style={styles.headerSubtitle}>
            Hold the mic and explain it out loud. Outloud is listening for your turn.
          </Text>
        </View>

        <View style={styles.bubbleSection}>
          <SpeechBubble />
          <Text style={styles.bubbleHint}>Listening pulse • tap when you want to speak</Text>
        </View>

        <View style={styles.actions}>
          <Button title="Tap to start speaking" onPress={() => {}} />
          <Button title="End session" variant="ghost" onPress={() => {}} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 32,
    gap: 8,
  },
  headerLabel: {
    ...typography.label,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 32,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    maxWidth: 320,
  },
  bubbleSection: {
    alignItems: 'center',
    gap: 20,
  },
  bubbleHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  actions: {
    gap: 12,
    paddingBottom: 16,
  },
});
