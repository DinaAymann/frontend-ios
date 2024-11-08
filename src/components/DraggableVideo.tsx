import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import YouTube from 'react-native-youtube-iframe';

const screenWidth = Dimensions.get('window').width;
const initialHeight = 220;
const initialWidth = screenWidth * 0.92;

interface DraggableVideoProps {
  videoId: string;
  onClose: () => void;
}

const DraggableVideo: React.FC<DraggableVideoProps> = ({ videoId, onClose }) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleFactor = useRef(new Animated.Value(1)).current;
  const [baseScale, setBaseScale] = useState(1);

  const getDistance = (touches) => {
    const [touch1, touch2] = touches;
    const dx = touch1.pageX - touch2.pageX;
    const dy = touch1.pageY - touch2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dx !== 0 || gestureState.dy !== 0 || gestureState.numberActiveTouches === 2,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          const touches = evt.nativeEvent.touches;
          if (touches.length === 2) {
            const distance = getDistance(touches);
            const newScaleFactor = (distance / 300) * baseScale;
            if (newScaleFactor >= 0.5 && newScaleFactor <= 3) {
              Animated.timing(scaleFactor, {
                toValue: newScaleFactor,
                useNativeDriver: false,
                duration: 0,
              }).start();
            }
          }
        } else {
          Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })(evt, gestureState);
        }
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
        setBaseScale(scaleFactor.__getValue());
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.draggableContainer,
        pan.getLayout(),
        {
          transform: [{ scale: scaleFactor }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <YouTube
        videoId={videoId}
        height={initialHeight}
        width={initialWidth}
        play={true}
      />
      <View style={styles.closeButton} onTouchEnd={onClose}>
        <Text style={styles.closeButtonText}>✖</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  draggableContainer: {
    width: initialWidth,
    height: initialHeight,
    position: 'absolute',
    top: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 3,
    top: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default DraggableVideo;

