import { Stack } from 'expo-router';
import { colors } from '@/styles/neumorphic';

export default function ConversationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitle: 'Conversation',
        headerTintColor: colors.text,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
