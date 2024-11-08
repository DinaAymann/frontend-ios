import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import MessageBubble from "./ReusableBubbleMessage";
import LinkPreviewWithDraggableVideo from "./LinkPreviewWithDraggableVideo";
import { useAudioPlayer } from './AudioPlayer'; 
import { isVideoLink } from "../../utils";
import ApiService from "./ApiService";

export type Memo = {
  uri?: string;
  text?: string;
  metering?: number[];
  type: "audio" | "text" | "link";
  audioSegments?: string[];
};

interface ChatScreenProps {
  memo: Memo;
  isOutgoing: boolean;
  onVideoClick: (url: string) => void;
  onCloseVideo: () => void;
  isPIPActive: boolean;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  memo,
  isOutgoing,
  onVideoClick,
  onCloseVideo,
  isPIPActive,
}) => {
  const [waveWidth, setWaveWidth] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isSeeking, setIsSeeking] = useState(false);

  const progress = useSharedValue(0);
  const seekerPosition = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const {
    playbackStatus,
    currentPosition,
    totalDuration,
    loadSounds,
    togglePlayback,
    seekToPosition,
    setPlaybackRate
  } = useAudioPlayer(memo.audioSegments);

  




  const [translation, setTranslation] = useState('');
  const [previewLink, setPreviewLink] = useState(null);  

  async function callTranscriptionService(audioUri) {
    try {
      const  translationResult = await ApiService.transcribeAndTranslate('arabic', audioUri);
      setTranslation(translationResult);
    } catch (error) {
      console.error('Error calling transcription service:', error);
    }
  }
  useEffect(() => {
    if (memo.type === "link" && memo.uri && isVideoLink(memo.uri)) {
      setPreviewLink(memo.uri);
    } else {
      setPreviewLink(null);
    }
  }, [memo]);

  useEffect(() => {
    if (memo.type === "audio") {
      loadSounds();
    }
  }, [memo.audioSegments]);

  useEffect(() => {
    if (!isDragging.value && !isSeeking) {
      progress.value = totalDuration ? currentPosition / totalDuration : 0;
      seekerPosition.value = withTiming(progress.value * waveWidth, { duration: 50 });
    }
  }, [currentPosition, totalDuration, isDragging.value, isSeeking]);

  useEffect(() => {
    if (playbackStatus === 'stopped') {
      progress.value = 0;
      seekerPosition.value = withTiming(0); 
    }
  }, [playbackStatus]);
  

  const handleSpeedChange = async () => {
    const newSpeed = playbackSpeed === 1.0 ? 1.5 : playbackSpeed === 1.5 ? 2.0 : 1.0;
    setPlaybackSpeed(newSpeed); 
    await setPlaybackRate(newSpeed); 
  };

  const gesture = Gesture.Pan()
  .onStart(() => {
    isDragging.value = true;
    runOnJS(setIsSeeking)(true);
  })
  .onUpdate((e) => {
    const newPosition = Math.max(0, Math.min(waveWidth, e.translationX + seekerPosition.value));
    seekerPosition.value = newPosition;
    progress.value = newPosition / waveWidth;
  })
  .onEnd(() => {
    isDragging.value = false;
    runOnJS(seekToPosition)(progress.value); 
    runOnJS(setIsSeeking)(false);
  });

    

  const animatedSeekerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: seekerPosition.value }],
  }));

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const generateWaveform = () => {
    if (!memo.metering?.length) return [];
    
    const numLines = 50;
    return Array.from({ length: numLines }, (_, i) => {
      const meteringIndex = Math.floor((i * memo.metering!.length) / numLines);
      const nextMeteringIndex = Math.ceil(((i + 1) * memo.metering!.length) / numLines);
      const values = memo.metering!.slice(meteringIndex, nextMeteringIndex);
      return values.reduce((sum, a) => sum + a, 0) / values.length;
    });
  };

  const waveformLines = generateWaveform();

  const renderAudioPlayer = () => (
    <>
      <View style={styles.controls}>
        <TouchableOpacity onPress={togglePlayback}>
          <FontAwesome5
            name={playbackStatus === "playing" ? "pause" : "play"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSpeedChange}>
          <Text style={styles.speedText}>{playbackSpeed}x</Text>
        </TouchableOpacity>
      </View>

      <View
        style={styles.playbackContainer}
        onLayout={(event) => setWaveWidth(event.nativeEvent.layout.width)}
      >
        <View style={styles.wave}>
          {waveformLines.map((db, index) => (
            <Animated.View
              key={index}
              style={[
                styles.waveLine,
                {
                  height: Math.max(5, Math.min(50, (db + 60) * (50 / 60))),
                  backgroundColor: progress.value * waveWidth >= (index / waveformLines.length) * waveWidth
                    ? "#34B7F1"
                    : "gainsboro",
                },
              ]}
            />
          ))}
        </View>
        
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.seeker, animatedSeekerStyle]} />
        </GestureDetector>
        
        <Text style={styles.timeText}>
          {formatTime(currentPosition)} / {formatTime(totalDuration)}
        </Text>
        {translation && (
            <Text style={styles.translationText}>{translation}</Text>
        )}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {memo.type === "text" && (
        <MessageBubble
          isOutgoing={isOutgoing}
          message={memo.text || ""}
          timestamp={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          type="text"
          onVideoPress={undefined}
        />
      )}

      {memo.type === "audio" && renderAudioPlayer()}

      {memo.type === "link" && (
        <LinkPreviewWithDraggableVideo
          url={memo.uri!}
          isOutgoing={isOutgoing}
          onVideoClick={onVideoClick}
          isPIPActive={isPIPActive}
          onCloseClick={onCloseVideo}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "#DCF8C6",
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 15,
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    zIndex: 0,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  playbackContainer: {
    flex: 1,
    height: 80,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  wave: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    width: "100%",
    height: 50,
  },
  waveLine: {
    flex: 1,
    backgroundColor: "gainsboro",
    borderRadius: 20,
  },
  seeker: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 10,
    bottom: 37,
    left: -5,
    backgroundColor: "#34B7F1",
    justifyContent: "center",
  },
  timeText: {
    position: "absolute",
    right: 0,
    bottom: 0,
    color: "gray",
    fontSize: 12,
  },
  speedText: {
    color: "gray",
    fontSize: 16,
    marginLeft: 10,
  },
  translationText: {
    position: "relative",
    color: "darkblue",
    fontSize: 14,
    textAlign: 'left',
    width: '100%',
  },
});

export default ChatScreen;