import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { AVPlaybackStatusSuccess, Audio } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Sound } from "expo-av/build/Audio";
import ApiService from './ApiService'; 
import MessageBubble from "./ReusableBubbleMessage";
import { isVideoLink } from "../../utils";
import LinkPreviewWithDraggableVideo from "./LinkPreviewWithDraggableVideo";

export type Memo = {
  uri?: string;
  text?: string;
  metering?: number[];
  type: "audio" | "text" | "link";
  audioSegments?: string[];
};

const ChatScreen = ({
  memo,
  isOutgoing,
  onVideoClick,
  onCloseVideo,
  isPIPActive,
}: {
  memo: Memo;
  isOutgoing: boolean;
  onVideoClick: (url: string) => void;
  onCloseVideo: () => void;
  isPIPActive: boolean;
}) => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [playbackStatus, setPlaybackStatus] = useState<"playing" | "paused" | "stopped">("stopped");
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isSoundLoaded, setIsSoundLoaded] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [waveWidth, setWaveWidth] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [hasFinished, setHasFinished] = useState<boolean>(false);
  const [segmentDurations, setSegmentDurations] = useState<number[]>([]);
  const [segmentStartPositions, setSegmentStartPositions] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const progress = useSharedValue(0);
  const seekerPosition = useSharedValue(0);
  const activeSound = useRef<Sound | null>(null);
  const playbackStatusRef = useRef(playbackStatus);
  const currentPositionRef = useRef(currentPosition);
  const lastPlaybackPosition = useRef<number>(0);

  const [translation, setTranslation] = useState('');
  const isPlaying = useSharedValue(false);
  const isDragging = useSharedValue(false);
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
    playbackStatusRef.current = playbackStatus;
    currentPositionRef.current = currentPosition;
  }, [playbackStatus, currentPosition]);

  const loadSound = useCallback(async () => {
    if (!memo.audioSegments?.length) return;
    
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const loadedSounds: Sound[] = [];
      const durations: number[] = [];
      const startPositions: number[] = [];
      let totalDurationMs = 0;

      const soundPromises = memo.audioSegments.map(segmentUri => 
        Audio.Sound.createAsync(
          { uri: segmentUri },
          { progressUpdateIntervalMillis: 50 }
        )
      );

      const results = await Promise.all(soundPromises);
      
      for (const { sound: newSound } of results) {
        const status = await newSound.getStatusAsync() as AVPlaybackStatusSuccess;
        const duration = status.durationMillis || 0;
        
        startPositions.push(totalDurationMs);
        totalDurationMs += duration;
        durations.push(duration);
        loadedSounds.push(newSound);
      }

      setSounds(loadedSounds);
      setSegmentDurations(durations);
      setSegmentStartPositions(startPositions);
      setTotalDuration(totalDurationMs);
      setIsSoundLoaded(true);
      // callTranscriptionService(memo.uri); 


      if (loadedSounds.length > 0) {
        await loadedSounds[0].setRateAsync(playbackSpeed, true);
      }
    } catch (error) {
      console.error("Error loading audio segments:", error);
    }
  }, [memo.audioSegments]);

  const updatePlaybackStatus = useCallback((status: "playing" | "paused" | "stopped") => {
    setPlaybackStatus(status);
  }, []);

  const findSegmentForPosition = useCallback((position: number) => {
    let segmentIndex = 0;
    for (let i = 0; i < segmentStartPositions.length; i++) {
      if (
        position >= segmentStartPositions[i] &&
        (i === segmentStartPositions.length - 1 ||
          position < segmentStartPositions[i + 1])
      ) {
        segmentIndex = i;
        break;
      }
    }
    return segmentIndex;
  }, [segmentStartPositions]);

  const updateProgress = useCallback((position: number) => {
    if (!isSeeking && !isDragging.value) {
      progress.value = position / totalDuration;
    }
  }, [isSeeking, isDragging.value, totalDuration]);

  const playCurrentSegment = async (segmentIndex: number, startPosition?: number) => {
    if (segmentIndex >= sounds.length || isTransitioning) return;
    
    const sound = sounds[segmentIndex];
    if (!sound) return;

    try {
      setIsTransitioning(true);
      
      const previousSound = activeSound.current;
      activeSound.current = sound;
      
      await sound.setRateAsync(playbackSpeed, true);
      if (startPosition !== undefined) {
        await sound.setPositionAsync(startPosition);
      }

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        
        if (sound === activeSound.current) {
          const currentPos = calculateCurrentPosition(segmentIndex, status.positionMillis);
          setCurrentPosition(currentPos);
          lastPlaybackPosition.current = currentPos; 
          runOnJS(updateProgress)(currentPos);

          const segmentDuration = segmentDurations[segmentIndex] || 0;
          const isNearEnd = status.positionMillis >= segmentDuration - 20;

          if (isNearEnd && !isDragging.value) {
            const nextSegmentIndex = segmentIndex + 1;
            if (nextSegmentIndex < sounds.length) {
              runOnJS(prepareNextSegment)(nextSegmentIndex);
            }
          }

          if (status.didJustFinish && !isDragging.value) {
            runOnJS(handleSegmentFinish)(segmentIndex);
          }
        }
      });

      if (previousSound) {
        previousSound.setOnPlaybackStatusUpdate(null);
        await previousSound.stopAsync();
      }

      await sound.playAsync();
      updatePlaybackStatus("playing");
      setCurrentSegmentIndex(segmentIndex);
      setIsTransitioning(false);
    } catch (error) {
      console.error("Error playing segment:", error);
      setIsTransitioning(false);
      updatePlaybackStatus("stopped");
      activeSound.current = null;
    }
  };

  const prepareNextSegment = async (nextSegmentIndex: number) => {
    if (nextSegmentIndex >= sounds.length) return;
    
    const nextSound = sounds[nextSegmentIndex];
    if (!nextSound) return;

    try {
      await nextSound.setRateAsync(playbackSpeed, true);
      await nextSound.setPositionAsync(0);
    } catch (error) {
      console.error("Error preparing next segment:", error);
    }
  };

  const handleSegmentFinish = async (finishedSegmentIndex: number) => {
    if (isTransitioning) return;
    
    const nextSegmentIndex = finishedSegmentIndex + 1;
    
    if (nextSegmentIndex < sounds.length) {
      const isCurrentlyPlaying = playbackStatusRef.current === "playing";
      
      if (isCurrentlyPlaying) {
        await playCurrentSegment(nextSegmentIndex, 0);
      } else {
        setCurrentSegmentIndex(nextSegmentIndex);
        setCurrentPosition(segmentStartPositions[nextSegmentIndex]);
      }
    } else {
      updatePlaybackStatus("stopped");
      setHasFinished(true);
      progress.value = 1;
      await stopAllSounds();
      activeSound.current = null;
    }
  };


const playSound = async () => {
  if (!isSoundLoaded) {
    await loadSound();
    return;
  }

  if (isTransitioning) return;

  try {
    if (playbackStatus === "playing") {
      const currentSound = activeSound.current;
      if (currentSound) {
        const status = await currentSound.getStatusAsync() as AVPlaybackStatusSuccess;
        if (status.isLoaded) {
          lastPlaybackPosition.current = calculateCurrentPosition(
            currentSegmentIndex,
            status.positionMillis
          );
        }
      }
      await pauseCurrentSegment();
    } else {
      let targetTimeMs;
      let targetSegmentIndex;

      if (playbackStatus === "paused") {
        targetTimeMs = lastPlaybackPosition.current;
        targetSegmentIndex = findSegmentForPosition(targetTimeMs);
      } else if (hasFinished) {
        targetTimeMs = 0;
        targetSegmentIndex = 0;
        await resetPlayback();
      } else {
        targetTimeMs = progress.value * totalDuration;
        targetSegmentIndex = findSegmentForPosition(targetTimeMs);
      }

      const segmentPosition = targetTimeMs - (segmentStartPositions[targetSegmentIndex] || 0);
      setCurrentSegmentIndex(targetSegmentIndex);
      await playCurrentSegment(targetSegmentIndex, segmentPosition);
    }
  } catch (error) {
    console.error("Error in playSound:", error);
    updatePlaybackStatus("stopped");
  }
};

const pauseCurrentSegment = async () => {
  if (activeSound.current) {
    try {
      const status = await activeSound.current.getStatusAsync() as AVPlaybackStatusSuccess;
      if (status.isLoaded) {
        lastPlaybackPosition.current = calculateCurrentPosition(
          currentSegmentIndex,
          status.positionMillis
        );
      }
      await activeSound.current.pauseAsync();
      updatePlaybackStatus("paused");
    } catch (error) {
      console.error("Error pausing sound:", error);
    }
  }
};

const calculateCurrentPosition = (segmentIndex: number, positionMillis: number) => {
  return (segmentStartPositions[segmentIndex] || 0) + positionMillis;
};

  const stopAllSounds = async () => {
    for (const sound of sounds) {
      try {
        const status = await sound.getStatusAsync() as AVPlaybackStatusSuccess;
        if (status.isLoaded && status.isPlaying) {
          await sound.stopAsync();
        }
        sound.setOnPlaybackStatusUpdate(null);
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
    }
    activeSound.current = null;
  };

  const handleSeek = useCallback(
    async (seekPosition: number) => {
      if (isTransitioning || !sounds.length) return;

      const targetTimeMs = seekPosition * totalDuration;
      const targetSegmentIndex = findSegmentForPosition(targetTimeMs);
      const segmentPosition = targetTimeMs - segmentStartPositions[targetSegmentIndex];
      const wasPlaying = playbackStatusRef.current === "playing";

      setIsTransitioning(true);
      await stopAllSounds();
      
      const sound = sounds[targetSegmentIndex];
      if (sound) {
        setCurrentSegmentIndex(targetSegmentIndex);
        await sound.setPositionAsync(segmentPosition);
        
        if (wasPlaying) {
          await playCurrentSegment(targetSegmentIndex, segmentPosition);
        } else {
          setCurrentPosition(targetTimeMs);
          setIsTransitioning(false);
        }
      }
      
      setHasFinished(false);
    },
    [sounds, totalDuration, segmentStartPositions, isTransitioning, findSegmentForPosition]
  );

  const resetPlayback = async () => {
    setCurrentSegmentIndex(0);
    setHasFinished(false);
    progress.value = 0;
    setCurrentPosition(0);
    updatePlaybackStatus("stopped");
    await stopAllSounds();
  };

  useEffect(() => {
    if (!isDragging.value) {
      seekerPosition.value = withTiming(progress.value * waveWidth, {
        duration: 50,
      });
    }
  }, [progress.value, waveWidth, isDragging.value]);


  const startX = useSharedValue(0);
  const gesture = Gesture.Pan()
    .onStart((e) => {
      isDragging.value = true;
      runOnJS(setIsSeeking)(true);
      startX.value = seekerPosition.value;
    })
    .onUpdate((e) => {
      if (isDragging.value) {
        const newPosition = Math.max(0, Math.min(waveWidth, startX.value + e.translationX));
        seekerPosition.value = newPosition;
        progress.value = newPosition / waveWidth;
      }
    })
    .onEnd(() => {
      isDragging.value = false;
      runOnJS(handleSeek)(progress.value);
      runOnJS(setIsSeeking)(false);
    });

  useEffect(() => {
    loadSound();
    return () => {
      sounds.forEach(sound => {
        sound.setOnPlaybackStatusUpdate(null);
        sound.unloadAsync();
      });
      activeSound.current = null;
    };
  }, [loadSound]);

  const animatedSeekerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: seekerPosition.value }],
  }));
  const formatMillis = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const numLines = 50;
  const lines = memo.metering?.length ? Array.from({ length: numLines }, (_, i) => {
    const meteringIndex = Math.floor((i * memo.metering!.length) / numLines);
    const nextMeteringIndex = Math.ceil(((i + 1) * memo.metering!.length) / numLines);
    const values = memo.metering!.slice(meteringIndex, nextMeteringIndex);
    return values.reduce((sum, a) => sum + a, 0) / values.length;
  }) : [];

  const changePlaybackSpeed = async () => {
    const newSpeed = playbackSpeed === 1.0 ? 1.5 : playbackSpeed === 1.5 ? 2.0 : 1.0;
    setPlaybackSpeed(newSpeed);
    
    const currentSound = sounds[currentSegmentIndex];
    if (currentSound && isPlaying.value) {
      await currentSound.setRateAsync(newSpeed, true);
    }
  };

  return (
    <View style={styles.container}>
     {memo.type === "text" && (
        <MessageBubble
          isOutgoing={isOutgoing}
          message={memo.text || ""}
          timestamp={new Date().toLocaleTimeString()}
          type="text"
          onVideoPress={undefined}
        />
      )}

      {memo.type === "audio" && (
        <>
      <View style={styles.controls}>
        <TouchableOpacity onPress={playSound}>
          <FontAwesome5
            name={playbackStatus === "playing" ? "pause" : "play"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={changePlaybackSpeed}>
          <Text style={styles.speedText}>{playbackSpeed}x</Text>
        </TouchableOpacity>
      </View>

      <View
        style={styles.playbackContainer}
        onLayout={(event) => {
          setWaveWidth(event.nativeEvent.layout.width);
        }}
      >
        <View style={styles.wave}>
          {lines.map((db, index) => (
            <Animated.View
              key={index}
              style={[
                styles.waveLine,
                {
                  height: Math.max(5, Math.min(50, (db + 60) * (50 / 60))),
                  backgroundColor: progress.value * waveWidth >= (index / lines.length) * waveWidth
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
          {formatMillis(currentPosition)} / {formatMillis(totalDuration)}
        </Text>
        {translation && (
            <Text style={styles.translationText}>{translation}</Text>
        )}
      </View>
        </>
      )}
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
    width: 20,
    height: 20,
    borderRadius: 10,
    bottom: 37,
    left: -5,
    backgroundColor: "#34B7F1",
    justifyContent:'center',
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
