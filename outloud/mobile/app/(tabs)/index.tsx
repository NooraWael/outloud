import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';

const DEMO_TOPICS = [
  {
    id: '1',
    title: 'Operating Systems - Deadlocks',
    description: 'Understand deadlock conditions and prevention',
    emoji: '💻',
  },
  {
    id: '2',
    title: 'Photosynthesis Basics',
    description: 'Explain light-dependent reactions',
    emoji: '🌱',
  },
  {
    id: '3',
    title: 'IELTS Speaking Practice',
    description: 'Describe your hometown',
    emoji: '🗣️',
  },
  {
    id: '4',
    title: 'Startup Pitch',
    description: 'Craft your value proposition',
    emoji: '🚀',
  },
];

export default function TopicsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose a Topic</Text>
        <Text style={styles.headerSubtitle}>Select what you want to learn about</Text>
      </View>
      
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {DEMO_TOPICS.map((topic) => (
          <Pressable
            key={topic.id}
            style={styles.card}
            onPress={() => router.push(`/conversation/${topic.id}`)}
          >
            <Text style={styles.emoji}>{topic.emoji}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{topic.title}</Text>
              <Text style={styles.cardDescription}>{topic.description}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e5ec',
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    backgroundColor: '#e0e5ec',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  emoji: {
    fontSize: 40,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});