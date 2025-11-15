import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { colors, typography } from '@/styles/neumorphic';

export default function OnboardingPage() {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.hero}>
        <View style={styles.heroGlow} />
        <Logo size={84} style={styles.logo} />
        <Text style={styles.title}>Explain it better by saying it aloud.</Text>

        <View style={styles.buttonStack}>
          <Button title="Start a conversation" onPress={() => router.push('/(tabs)')} />
          <Button
            title="I already have an account"
            variant="secondary"
            onPress={() => router.push('/(auth)/login')}
          />
        </View>

        <Text style={styles.signupPrompt}>
          Don’t have an account?
          <Text style={styles.signupText}> Sign up</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute',
    top: '20%',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(78, 205, 196, 0.12)',
    opacity: 0.6,
    alignSelf: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 30,
    transform: [{ translateY: -30 }],
  },
  logo: {
    marginBottom: 24,
  },
  title: {
    ...typography.h1,
    fontSize: 46,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonStack: {
    width: '100%',
    gap: 12,
  },
  signupPrompt: {
    ...typography.caption,
    fontSize: 14,
    marginTop: 24,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  signupText: {
    color: colors.text,
    fontWeight: '600',
  },
});
