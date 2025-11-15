import { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, glassCard } from '../../styles/neumorphic';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'highlighted';
}

export default function GlassCard({ 
  children, 
  style,
  variant = 'default',
}: GlassCardProps) {
  return (
    <View 
      style={[
        styles.card, 
        variant === 'highlighted' && styles.highlighted,
        style
      ]}
    >
      <View style={styles.border} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...glassCard,
    position: 'relative',
  },
  highlighted: {
    borderColor: 'rgba(78, 205, 196, 0.3)',
    backgroundColor: 'rgba(78, 205, 196, 0.08)',
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});