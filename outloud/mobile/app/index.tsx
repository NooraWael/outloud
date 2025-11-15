import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function LandingPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎤</Text>
        <Text style={styles.title}>Outloud</Text>
        <Text style={styles.subtitle}>Learn by Talking Back</Text>
        <Text style={styles.description}>
          Have real conversations with AI mentors. Get instant feedback with color-coded heatmaps.
        </Text>
      </View>
      
      <View style={styles.buttons}>
        <Pressable 
          style={styles.buttonPrimary}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.buttonPrimaryText}>Try Demo</Text>
        </Pressable>
        
        <Pressable 
          style={styles.buttonSecondary}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.buttonSecondaryText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e5ec',
    padding: 24,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 50,
  },
  content: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#7f8c8d',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttons: {
    gap: 16,
  },
  buttonPrimary: {
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  buttonSecondaryText: {
    color: '#4ECDC4',
    fontSize: 18,
    fontWeight: '600',
  },
});