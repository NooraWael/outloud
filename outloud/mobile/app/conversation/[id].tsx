import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Conversation for topic {id}</Text>
      <Text style={styles.subtext}>Recording UI will go here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e5ec',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#7f8c8d',
  },
});