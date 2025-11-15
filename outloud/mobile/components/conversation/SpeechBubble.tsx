import { memo, useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const bubbleSource = require('@/assets/images/test.gif');

function SpeechBubble() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.9 + pulse.value * 0.1 }],
    opacity: 0.75 + pulse.value * 0.25,
  }));

  return (
    <AnimatedImage source={bubbleSource} style={[styles.image, animatedStyle]} resizeMode="contain" />
  );
}

export default memo(SpeechBubble);

const styles = StyleSheet.create({
  image: {
    width: 240,
    height: 240,
  },
});
