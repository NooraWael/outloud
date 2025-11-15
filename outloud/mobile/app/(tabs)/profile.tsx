import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  // TODO: Replace with actual user data
  const user = {
    username: 'demo_user',
    isGuest: true,
    conversationsCount: 0,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={48} color="#4ECDC4" />
        </View>
        <Text style={styles.username}>{user.username}</Text>
        {user.isGuest && (
          <View style={styles.guestBadge}>
            <Text style={styles.guestBadgeText}>Guest User</Text>
          </View>
        )}
      </View>

      {/* Stats Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Progress</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.conversationsCount}</Text>
            <Text style={styles.statLabel}>Conversations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Topics Studied</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      {user.isGuest ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Save Your Progress</Text>
          <Text style={styles.cardDescription}>
            Create an account to save your conversations and track your learning progress.
          </Text>
          <Pressable
            style={styles.buttonPrimary}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={styles.buttonPrimaryText}>Create Account</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <MenuButton
            icon="settings-outline"
            label="Settings"
            onPress={() => {}}
          />
          <MenuButton
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => {}}
          />
          <MenuButton
            icon="log-out-outline"
            label="Logout"
            onPress={() => {}}
            danger
          />
        </View>
      )}

      {/* About */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Outloud v1.0.0</Text>
        <Text style={styles.footerText}>Built for CS Girlies Hackathon</Text>
      </View>
    </ScrollView>
  );
}

// Reusable Menu Button Component
function MenuButton({
  icon,
  label,
  onPress,
  danger = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.menuButton} onPress={onPress}>
      <Ionicons
        name={icon}
        size={24}
        color={danger ? '#FF6B6B' : '#7f8c8d'}
      />
      <Text style={[styles.menuButtonText, danger && styles.menuButtonTextDanger]}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e5ec',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  // Card
  card: {
    backgroundColor: '#e0e5ec',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 16,
  },

  // Avatar
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e0e5ec',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  guestBadge: {
    backgroundColor: '#FFE66D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#d1d9e6',
  },

  // Buttons
  buttonPrimary: {
    backgroundColor: '#4ECDC4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Menu
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d9e6',
  },
  menuButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  menuButtonTextDanger: {
    color: '#FF6B6B',
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
});