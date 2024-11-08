import { useState, useRef, useEffect, useCallback, useContext, memo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Text,
  PanResponder,
  Keyboard,
} from "react-native";
import { Audio } from "expo-av";
import { Recording } from "expo-av/build/Audio";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
import React from "react";
import ChatScreen, { Memo } from "./ChatScreen";
import SingleChatHeader from "./Headers/SingleChatHeader";
import { isVideoLink } from "../../utils";
import WebView from "react-native-webview";
import { useChat } from "./ChatContext";
import { useNavigation } from "@react-navigation/native";
import DraggableVideo from "./DraggableVideo";
import { LanguageContext } from "./LanguageContext";
import { useAudioPlayer } from "./AudioPlayer";
import { Gesture } from "react-native-gesture-handler";

export default function ChatInputArea({ route }) {
  
  const { chatId, title, isGroupChat, selectedChats } = route.params;
  const { chats } = useChat();
  const chat = chatId
    ? chats.find((c: { id: any }) => c.id === chatId)
    : { messages: [] };
  const [message, setMessage] = useState("");
  const navigation = useNavigation();
  const chatTitle = isGroupChat ? title : chat?.user || "Chat";
  const userProfilePhoto = isGroupChat
    ? "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"
    : chat?.profilePhotoUrl;
  const [recording, setRecording] = useState<Recording | null>(null);
  const [memos, setMemos] = useState<Memo[]>(chat?.messages || []);
  const [isRecordingLocked, setIsRecordingLocked] = useState(false);
  const [isRecordingActive, setIsRecordingActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  //const [isSwiping, setIsSwiping] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const [playbackSound, setPlaybackSound] = useState<Audio.Sound | null>(null);
  const [recordingURI, setRecordingURI] = useState<string | null>(null);
  const metering = useSharedValue(-100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [previewLink, setPreviewLink] = useState<string | null>(null);
  const micFlash = useSharedValue(1);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimeoutRef = useRef(null);
  const slideToCancelOpacity = useSharedValue(1);
  const basketOpacity = useSharedValue(0);
  const swipeTranslateX = useSharedValue(0);
  const bounceValue = useSharedValue(0);
  const lockOpacity = useSharedValue(1);
  const LOCK_THRESHOLD = 550;
  const LOCK_THRESHOLD1 = 750;
  const lockProgress = useSharedValue(0);
  const [showTimer, setShowTimer] = useState(false);
  const [showCancelText, setShowCancelText] = useState(false);
  const translateX = useSharedValue(0);
  const DELETE_THRESHOLD = 250;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const slideToCancelTranslateX = useSharedValue(0);
  const [audioMetering, setAudioMetering] = useState<number[]>([]);
  const textInputRef = useRef<TextInput>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPIPActive, setIsPIPActive] = useState(false);
  const [audioSegments, setAudioSegments] = useState<string[]>([]);
  const [status, setStatus] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [isPlaybackActive, setIsPlaybackActive] = useState(false);
  const { language } = useContext(LanguageContext);

  const progress = useSharedValue(0);
  const seekerPosition = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const [isSeeking, setIsSeeking] = useState(false);

  
  const [showHoldToRecordMessage, setShowHoldToRecordMessage] = useState(false);
  const meteringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageTimeoutRef = useRef(null);
  const [showPlaybackUI, setShowPlaybackUI] = useState(false);
  const {
    playbackStatus,
    togglePlayback,
    seekToPosition,
    loadSounds,
    setPlaybackRate ,
    playbackSpeed,  } = useAudioPlayer(audioSegments ); 

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  useEffect(() => {
    if (audioSegments.length > 0) {
      loadSounds();
      setShowPlaybackUI(true);
    }
  }, [audioSegments]);

  const handleSpeedChange = () => {
    const newSpeed = playbackSpeed === 1.0 ? 1.5 : playbackSpeed === 1.5 ? 2.0 : 1.0;
    setPlaybackRate(newSpeed);
  };

  useEffect(() => {
    if (!isPaused) {
      meteringIntervalRef.current = setInterval(() => {
        setAudioMetering((currentMetering) => [
          ...currentMetering,
          generateRandomWaveformValue(), 
        ]);
      }, 100); 
    } else if (meteringIntervalRef.current) {
        clearInterval(meteringIntervalRef.current);
        meteringIntervalRef.current = null;
      }
    return () => {
      if (meteringIntervalRef.current) {
        clearInterval(meteringIntervalRef.current);
      }
    };
  }, [isPaused]);

  useEffect(() => {
    if (!isRecordingLocked) {
      startBounce();
    }
  }, [isRecordingLocked]);
  
  const animatedSlideToCancelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideToCancelTranslateX.value }],
    opacity: slideToCancelOpacity.value,
  }));

  const animatedBasketStyle = useAnimatedStyle(() => {
    return {
      opacity: basketOpacity.value,
      transform: [
        { scale: interpolate(basketOpacity.value, [0, 1], [0.5, 1]) },
      ],
    };
  });

  const animatedMicStyle = useAnimatedStyle(() => {
    return {
      opacity: micFlash.value,
    };
  });

  const animatedLockStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: bounceValue.value * -10,
        },
      ],
      opacity: lockOpacity.value,
    };
  });

  const startBounce = () => {
    bounceValue.value = withRepeat(
      withSpring(-1, { damping: 1, stiffness: 100 }),
      -1,
      true
    );
  };

  const startFlashingMic = () => {
    micFlash.value = withRepeat(withTiming(0, { duration: 600 }), -1, true);
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  async function startRecording() {
    try {
      await deleteRecording();
  
      startFlashingMic();
      setAudioMetering([]);
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
  
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecordingActive(true);
  
      // Start the lock bounce animation immediately
      startBounce();
  
      startTimer();
  
      recording.setOnRecordingStatusUpdate((status) => {
        if (
          typeof status.metering === "number" &&
          !isNaN(status.metering) &&
          !isPaused
        ) {
          metering.value = status.metering;
          setAudioMetering((curVal) => [...curVal, status.metering || -100]);
        }
      });
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  

  const loadSound = async (uri) => {
    if (uri) {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { progressUpdateIntervalMillis: 50 },
        onPlaybackStatusUpdate
      );
      setPlaybackSound(sound);
    }
  };

  const onPlaybackStatusUpdate = useCallback((newStatus) => {
    setStatus(newStatus);
    if (!newStatus.isLoaded) return;

    if (newStatus.didJustFinish) {
      setIsPlaybackActive(false);
    }
  }, []);

  const pauseRecording = async () => {
    if (!recording) return;

    try {
      const status = await recording.getStatusAsync();
      if (status.isRecording) {
        await recording.stopAndUnloadAsync();
      }

      setIsPaused(true);
      stopTimer();

      const uri = await recording.getURI();
      if (uri) {
        setAudioSegments((prevSegments) => [...prevSegments, uri]);
      }

      await loadSound(uri);
    } catch (error) {
      console.error("Error pausing recording:", error);
    } finally {
      setRecording(null);
      micFlash.value = 1;
    }
  };

  const resumeRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true, 
      playThroughEarpieceAndroid: false,
      shouldDuckAndroid: true,
    });
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsPaused(false);
      startTimer();
    } catch (error) {
      console.error("Error resuming recording:", error);
    }
  };

  const deleteRecording = async () => {
    try {
      if (recording) {
        const status = await recording.getStatusAsync();
        if (status.isRecording || status.isDoneRecording) {
          await recording.stopAndUnloadAsync();
        }
      }
      if (playbackSound) {
        await playbackSound.stopAsync();
        await playbackSound.unloadAsync();
      }
      setRecording(null);
      setPlaybackSound(null);
      setRecordingURI(null);
      setIsRecordingLocked(false);
      setIsRecordingActive(false);
      setIsPlaybackActive(false);
      setPlaybackPosition(0);
      stopTimer();
      setRecordingTime(0);
      setPausedTime(0);
      setAudioMetering([]);
      setAudioSegments([]);
      setShowPlaybackUI(false); 
      setIsPaused(false); 
      micFlash.value = 1;
  
      if (loadSounds) {
        await loadSounds(); 
      }
  
      progress.value = 0;
      seekerPosition.value = 0;
      isDragging.value = false;
      setIsSeeking(false);
  
    } catch (error) {
      console.error("Error deleting recording:", error);
    }
  };

  const stopRecording = async () => {
    stopTimer();
    if (!recording) return;
  
    try {
      const status = await recording.getStatusAsync();
      if (status.isRecording) {
        await recording.stopAndUnloadAsync();
      }
  
      const uri = await recording.getURI();
      if (uri) {
        setAudioSegments((prevSegments) => [...prevSegments, uri]);
      }
  
      const allSegments = [...audioSegments, uri].filter(Boolean);
      if (allSegments.length > 0) {
        const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
        const fileName = `recording_${timestamp}.m4a`;
  
        setMemos((existingMemos) => [
          ...existingMemos,
          {
            metering: audioMetering.filter((v) => !isNaN(v)),
            type: "audio",
            audioSegments: allSegments,
            fileName,
          },
        ]);
      }
    } catch (err) {
      console.error("Error stopping recording", err);
    } finally {
      setRecording(null);
      setIsRecordingLocked(false);
      setIsRecordingActive(false);
      setRecordingTime(0);
      setPausedTime(0);
      setAudioMetering([]);
      setPlaybackSound(null);
      setAudioSegments([]);
      micFlash.value = 1;
    }
  };
  const generateWaveform = () => {
    if (!audioMetering?.length) return [];
    
    const numLines = 50; 
    return Array.from({ length: numLines }, (_, i) => {
      const meteringIndex = Math.floor((i * audioMetering.length) / numLines);
      const nextMeteringIndex = Math.ceil(((i + 1) * audioMetering.length) / numLines);
      const values = audioMetering.slice(meteringIndex, nextMeteringIndex);
      return values.reduce((sum, a) => sum + a, 0) / values.length;
    });
  };
  
  const waveformLines = generateWaveform();
  

  const handleVideoClick = (url: string) => {
    setVideoUrl(url);
    setIsVideoVisible(true);
    setIsPIPActive(true);
  };

  const handleCloseVideo = () => {
    setIsVideoVisible(false);
    setIsPIPActive(false); 
  };

  const handleTextInputChange = (text: string) => {
    setMessage(text);
    if (isVideoLink(text.trim())) {
      setPreviewLink(text.trim());
    } else {
      setPreviewLink(null);
    }
  };

  const handleTitlePress = () => {
    if (selectedChats && selectedChats.length > 1) {
      navigation.navigate("GroupInfoScreen", {
        selectedChats: selectedChats,
      });
    } else {
      if (chat && chat?.profilePhotoUrl) {
        navigation.navigate("ContactInfoScreen", {
          userProfilePhoto: chat?.profilePhotoUrl,
          userName: chat?.user,
        });
      }
    }
  };

  const handleLongPress = () => {
    holdTimeoutRef.current = setTimeout(() => {
      setIsHolding(true);
      startRecording();
      setShowHoldToRecordMessage(false);
      startFlashingMic();
    }, 1500); 
  
  };
  const handleShortPress = () => {
    setShowHoldToRecordMessage(true);
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    messageTimeoutRef.current = setTimeout(() => {
      setShowHoldToRecordMessage(false);
    }, 1000);
  };
  const handleSendPress = async () => {
    if (message.trim()) {
      const newMemo: Memo = { text: message, type: "text" };
      if (isVideoLink(message.trim())) {
        newMemo.type = "link";
        newMemo.uri = message.trim();
      }
      setMemos((prevMemos) => [...prevMemos, newMemo]);
      setMessage("");
      setPreviewLink(null);
    } else if (recording || audioSegments.length > 0) {
      stopTimer();  
      if (isPaused) {
        const allSegments = [...audioSegments].filter(Boolean);
        if (allSegments.length > 0) {
          const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
          const fileName = `recording_${timestamp}.m4a`;
          setMemos((existingMemos) => [
            ...existingMemos,
            {
              metering: audioMetering.filter((v) => !isNaN(v)),
              type: "audio",
              audioSegments: allSegments,
              fileName,
            },
          ]);
        }
        setAudioSegments([]);
        setPausedTime(0);
        setAudioMetering([]);
        setIsPaused(false); 
        await deleteRecording(); 
      } else {
        await stopRecording();  
      }
    }
  };
  
  let startY = 550;
  let startX = 100;
  let startY1 = 750;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (_, gestureState) => {
      startY = gestureState.y0;
      startX = gestureState.x0;
      startY1 = gestureState.y0;

      if (isHolding) {
        startFlashingMic();
      }
    },

    onPanResponderMove: (_, gestureState) => {
      if (!isHolding) return;

      const deltaY = gestureState.moveY - startY;
      const deltaX = gestureState.moveX - startX;
      slideToCancelTranslateX.value = deltaX;

      const deltaY1 = gestureState.moveY - startY1;

      if (
        deltaY <= LOCK_THRESHOLD &&
        !isRecordingLocked &&
        gestureState.moveY < startY &&
        isKeyboardVisible
      ) {
        runOnJS(setIsRecordingLocked)(true);
      } else if (
        deltaY1 <= LOCK_THRESHOLD1 &&
        !isRecordingLocked &&
        gestureState.moveY < startY1 &&
        !isKeyboardVisible
      ) {
        runOnJS(setIsRecordingLocked)(true);
      }
      lockProgress.value = Math.min(0, Math.max(-1, deltaY / LOCK_THRESHOLD));

      translateX.value = deltaX;
      swipeTranslateX.value = deltaX;

      if (deltaX <= DELETE_THRESHOLD) {
        runOnJS(setShowCancelText)(true);
        slideToCancelOpacity.value = withTiming(0);
        basketOpacity.value = withTiming(1);
      } else {
        runOnJS(setShowCancelText)(false);
        slideToCancelOpacity.value = withTiming(1);
        basketOpacity.value = withTiming(0);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      clearTimeout(holdTimeoutRef.current);

      if (showCancelText) {
        runOnJS(deleteRecording)();
      } else if (!isRecordingLocked) {
        runOnJS(stopRecording)();
      } else if (isRecordingLocked && !isKeyboardVisible) {
        runOnJS(() => textInputRef.current?.focus())();
      }

      swipeTranslateX.value = withSpring(0);
      slideToCancelTranslateX.value = withSpring(0);
      slideToCancelOpacity.value = withTiming(0);
      basketOpacity.value = withTiming(0);
      translateX.value = withSpring(0);
      lockProgress.value = withSpring(0);
      runOnJS(setShowTimer)(false);
      runOnJS(setShowCancelText)(false);
      runOnJS(setIsHolding)(false);
      setShowHoldToRecordMessage(false);
    },
  });

  const renderVideoPreview = () => {
    if (previewLink && isVideoLink(previewLink)) {
      const embedUrl = getEmbedUrl(previewLink);
      return (
        <View style={styles.previewContainer}>
          <WebView source={{ uri: embedUrl }} />
        </View>
      );
    }
    return null;
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1] || url.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const generateRandomWaveformValue = () => {
    return Math.random() * -60;
  };

  const renderWaveform = () => {
    return (
      <Animated.View style={styles.wave}>
        {audioMetering.slice(-83).map((db, index) => (
          <View
            key={index}
            style={[
              styles.waveformBar,
              {
                height: interpolate(db, [-60, 0], [5, 15], Extrapolation.CLAMP),
                backgroundColor: 'royalblue',
              },
            ]}
          />
        ))}
      </Animated.View>
    );
  };
  const [waveWidth, setWaveWidth] = useState(0);

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


  return (
    <View style={styles.container}>
      <SingleChatHeader
        navigation={navigation}
        title={chatTitle}
        userProfilePhoto={userProfilePhoto}
        onTitlePress={handleTitlePress}
      />
  
      <FlatList
        data={memos}
        keyExtractor={(item, index) => item.uri || item.text || index.toString()}
        renderItem={({ item }) => (
          <View>
            <ChatScreen 
              memo={item} 
              isOutgoing={true} 
              onVideoClick={handleVideoClick} 
              isPIPActive={isPIPActive} 
              onCloseVideo={handleCloseVideo} 
            />
          </View>
        )}
        inverted={false}
      />
  
      {isVideoVisible && videoUrl && (
        <View style={styles.videoContainer}>
          <DraggableVideo videoId={videoUrl} onClose={handleCloseVideo} />
        </View>
      )}
  
      {previewLink && (
        <View>
          {renderVideoPreview()}
        </View>
      )}
  
      {showHoldToRecordMessage && (
        <View>
          <View style={styles.holdMessageContainer}>
            <Text style={styles.holdMessageText}>Hold to record, release to send</Text>
          </View>
          <View style={styles.holdMessageTail} />
        </View>
      )}
  
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={[styles.footer, isKeyboardVisible && null]} {...panResponder.panHandlers}>
          {isRecordingLocked ? (
            <View style={[styles.recordingLocked, isKeyboardVisible && null]}>
              <TextInput
                ref={textInputRef}
                style={[styles.input, { opacity: 0, height: 0 }]} 
                onChangeText={handleTextInputChange}
                placeholder="Type a message..."
                editable={true}
              />
              
              <View style={styles.waveformAndTimer}>
                <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
                {isPaused ? (
                  <View style={styles.playbackContainer}>
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
                   
                  </View>
                    </View>
                   
                ) : (
                  <View style={styles.waveformContainer}>
                    {renderWaveform()}
                  </View>
                )}
              </View>
  
              <View style={[styles.controlButtons, isKeyboardVisible && { paddingBottom: 20 }]}>
                <TouchableOpacity style={styles.controlButton} onPress={deleteRecording}>
                  <AntDesign name="delete" size={30} color="black" />
                </TouchableOpacity>
  
                <TouchableOpacity style={styles.controlButton} onPress={isPaused ? resumeRecording : pauseRecording}>
                  <AntDesign name={isPaused ? "playcircleo" : "pausecircleo"} size={30} color="red" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={handleSendPress}>
                  <MaterialCommunityIcons name="send-circle" size={40} color="green" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.recordingArea}>
              <TextInput
                ref={textInputRef}
                style={styles.input}
                value={message}
                onChangeText={handleTextInputChange}
                placeholder="Type a message..."
                editable={!isRecordingLocked}
              />
  
              {isRecordingActive && (
                <View style={[styles.recordingActiveArea, isKeyboardVisible && null]}>
                  {slideToCancelTranslateX.value > DELETE_THRESHOLD ? (
                    <Animated.View style={animatedMicStyle}>
                      <Ionicons name="mic" size={34} color="red" />
                    </Animated.View>
                  ) : (
                    <Animated.View style={[styles.basketIcon, animatedBasketStyle]}>
                      <AntDesign name="delete" size={34} color="red" />
                    </Animated.View>
                  )}
                  {basketOpacity.value === 0 && (
                    <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
                  )}
                  {!isRecordingLocked && isRecordingActive && (
                    <Animated.Text style={[styles.slideToCancelText, animatedSlideToCancelStyle]}>
                      Slide to Cancel {'>'}
                    </Animated.Text>
                  )}
                </View>
              )}
  
              {message.trim() ? (
                <TouchableOpacity onPress={handleSendPress} style={styles.iconButton}>
                  <MaterialCommunityIcons name="send-circle" size={40} color="green" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onLongPress={handleLongPress} onPressOut={handleShortPress}>
                  <Feather name="mic" size={28} color="black" />
                </TouchableOpacity>
              )}
  
              <View style={[styles.audioButtonContainer, isKeyboardVisible && null]}>
                {isRecordingActive && !isRecordingLocked && (
                  <Animated.View style={[styles.lockContainer, animatedLockStyle]}>
                    <Icon name="lock-open" size={30} color="black" />
                  </Animated.View>
                )}
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
  
}  
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    height: 90,
    bottom: -10,
  },

  videoContainer: {
    position: "absolute",
    top: 110,
    width: 100,
    height: 250,
  },

  recordingLocked: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    bottom: 42,
    height: 100,
  },

  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffff",
  },
  recordingArea: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f0f0f0",
    bottom: 13,
    padding: 10,
  },
  recordingActiveArea: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#f0f0f0",
  },

  expandedFooter: {
    height: 120,
    justifyContent: "space-between",
    paddingTop: 15,
    backgroundColor: "#f0f0f0",
  },

  lockContainer: {
    position: "absolute",
    top: -100,
    alignSelf: "center",
    backgroundColor: "white",
    padding: -10,
    borderRadius: 20,
    elevation: 5,
    zIndex: 1,
    right: 0.51,
  },
  audioButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  previewContainer: {
    height: 150,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  waveformAndTimer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  waveformBar: {
    width: 2,
    marginHorizontal: 0.2,
    borderRadius: 2,
  },
  wave: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    justifyContent: "flex-end",
  },
  waveformContainer: { 
    flex: 1, 
    marginLeft: 10 
  },

  segmentContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  timerText: {
    fontSize: 25,
    color: "gray",
    justifyContent: "flex-start",
    padding: 5,
    alignItems: "flex-start",
    fontWeight: "500",
  },
  slideToCancelText: {
    color: "gray",
    fontSize: 25,
    marginLeft: -250,
    fontWeight: "500",
  },
  controlButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingBottom: 50,
  },
  controlButton: {
    padding: 1,
  },
  basketIcon: {
    position: "absolute",
    left: 20,
  },
  iconButton: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  holdMessageContainer: {
    position: "absolute",
    bottom: '15%',          
    right: '1%',             
    backgroundColor: "#DCF8C6", 
    paddingVertical: 10,    
    paddingHorizontal: 20,   
    borderRadius: 10,      
    alignSelf: "flex-end",   
    elevation: 5,            
    shadowColor: "#000",   
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  holdMessageText: {
    color: "black",        
    fontSize: 16,           
    fontWeight: "500",     
    textAlign: "center",    
  },
  holdMessageTail: {
    position: "absolute",
    bottom: -6,          
    right: 10,            
    width: 0,
    height: 0,
    borderLeftWidth: 6,   
    borderRightWidth: 6,  
    borderTopWidth: 6,    
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(60, 60, 60, 0.9)",
  },
 
  speedText: {
    fontSize: 16,
    color: "gray",
    marginLeft: 10,
  },
  timeText: {
    fontSize: 14,
    color: "gray",
    marginLeft: 10,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  waveLine: {
    flex: 1,
    backgroundColor: "gainsboro",
    borderRadius: 20,
  },

  playbackContainer: {
    flex: 1,
    height: 50,                  
    alignItems: "center",       
    justifyContent: "center",
    backgroundColor: "#f9f9f9",  
    paddingVertical: 10,      
    paddingHorizontal: 35,
    borderWidth: 1,             
    borderColor: "#ddd",         
    borderRadius: 15,            
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
 WaveContainer: {
    flex: 1,
    height: 80,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  
});
