import { Stack } from 'expo-router';
import { colors } from '@/styles/neumorphic';

export default function ConversationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
