import { Image, StyleSheet, View, ViewStyle } from 'react-native';

interface LogoProps {
  size?: number;
  style?: ViewStyle;
}

export default function Logo({ size = 60, style }: LogoProps) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});