import { ViewStyle, TextStyle } from 'react-native';

// Dark glassmorphic color tokens
export const colors = {
  // Dark backgrounds
  background: '#0a0e1a',
  backgroundSecondary: '#121829',
  
  // Glassmorphic surfaces
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassHover: 'rgba(255, 255, 255, 0.08)',
  
  // Brand colors 
  primary: '#4ECDC4',
  accent: '#FFE66D',
  coral: '#FF6B6B',
  
  // Text
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.4)',
  
  // Gradients
  gradientStart: '#1a2332',
  gradientEnd: '#0a0e1a',
};

// Glassmorphic card style
export const glassCard: ViewStyle = {
  backgroundColor: colors.glass,
  borderRadius: 24,
  borderWidth: 1,
  borderColor: colors.glassBorder,
  padding: 24,
  overflow: 'hidden',
};

// Typography
export const typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: -1,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textMuted,
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
};