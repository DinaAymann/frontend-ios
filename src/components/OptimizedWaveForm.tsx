import React, { memo, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const OptimizedWaveform = memo(({ audioMetering, isPlaying }: { audioMetering: number[], isPlaying: boolean }) => {
  const translateX = useSharedValue(0);
  const animatedWaveformStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  const startAnimation = () => {
    translateX.value = withRepeat(
      withTiming(-155, {
        duration: 100,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  };
  useEffect(() => {
    if (isPlaying) {
      startAnimation();
    }
  }, [isPlaying]);
  const createSmoothMeteringData = (meteringData, length = 5) => {
    const result = [];
    const originalLength = meteringData.length;

    for (let i = 0; i < length * originalLength; i++) {
      const current = meteringData[i % originalLength];
      const next = meteringData[(i + 1) % originalLength];
      const interpolatedValue = interpolate(i % originalLength, [0, originalLength], [current, next], Extrapolation.CLAMP);
      result.push(interpolatedValue);
    }

    return result;
  };
  const smoothMeteringData = createSmoothMeteringData(audioMetering, 5);
  return (
    <View style={styles.wave}>
      {smoothMeteringData.slice(-55).map((db, index) => (
        <Animated.View
          key={index}
          style={[
            styles.waveformBar,
            animatedWaveformStyle,
            {
              height: interpolate(db, [-40, 5], [5, 50], Extrapolation.CLAMP),
              backgroundColor: "royalblue",
              marginRight: 2,
            },
          ]}
        />
      ))}
    </View>
  );
});

export default OptimizedWaveform;

const styles = StyleSheet.create({
  wave: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    justifyContent: "flex-end",
  },
  waveformBar: {
    width: 2,
    marginHorizontal: 0.9,
    borderRadius: 2,
  },
});
