import { useState, useRef, useEffect, useCallback, useContext } from "react";
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
import OptimizedWaveform from "./OptimizedWaveForm";
import { LanguageContext } from "./LanguageContext";

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
  const [isSwiping, setIsSwiping] = useState(false);
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
    if (!isRecordingLocked) {
      startBounce();
    }
  }, [isRecordingLocked]);

  const handleVideoClick = (url: string) => {
    setVideoUrl(url);
    setIsVideoVisible(true);
    setIsPIPActive(true);
  };

  const handleCloseVideo = () => {
    setIsVideoVisible(false);
    setIsPIPActive(false); 
  };
  

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

  async function startRecording() {
    try {
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
      setIsRecordingLocked(false);
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

  const playMergedAudio = async () => {
    if (audioSegments.length === 0) return;

    setIsPlaybackActive(true);
    let mergedAudioURI = null;

    try {
      for (let i = 0; i < audioSegments.length; i++) {
        const uri = audioSegments[i];
        if (i === 0) {
          mergedAudioURI = uri;
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { progressUpdateIntervalMillis: 50 }
        );
        setPlaybackSound(newSound);
        await newSound.playAsync();

        await new Promise<void>((resolve, reject) => {
          newSound.setOnPlaybackStatusUpdate(async (status) => {
            if (status.didJustFinish) {
              try {
                await newSound.unloadAsync();
                resolve();
              } catch (error) {
                reject(error);
              }
            }
          });
        });
      }
    } catch (error) {
      console.error("Error playing merged audio:", error);
    } finally {
      setIsPlaybackActive(false);
      setPlaybackPosition(0);
      setPlaybackSound(null);
    }

    return mergedAudioURI;
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
      micFlash.value = 1;
    } catch (error) {
      console.error("Error deleting recording:", error);
    }
  };

  const stopRecording = async () => {
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
      stopTimer();
      setRecordingTime(0);
      setPausedTime(0);
      setAudioMetering([]);
      setPlaybackSound(null);
      setAudioSegments([]);
      micFlash.value = 1;
    }
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
      await stopRecording();
    }
  };

  const handleTextInputChange = (text: string) => {
    setMessage(text);
    if (isVideoLink(text.trim())) {
      setPreviewLink(text.trim());
    } else {
      setPreviewLink(null);
    }
  };

  const handleLongPress = () => {
    setIsHolding(true);
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
        startRecording();
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
        keyExtractor={(item) => `${item.uri || item.text}`}
        renderItem={({ item }) => (
          <View>
            <ChatScreen memo={item} isOutgoing={true} onVideoClick={handleVideoClick} isPIPActive={isPIPActive} 
        onCloseVideo={handleCloseVideo}/>
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
      <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
     
        <View style={[
                styles.footer,
                isKeyboardVisible && null,
              ]} {...panResponder.panHandlers}>
         {isRecordingLocked ? (
            <View
              style={[
                styles.recordingLocked,
                isKeyboardVisible && null,
              ]}
            >
              <TextInput
                ref={textInputRef}
                style={[styles.input, { opacity: 0, height: 0 }]} 
                onChangeText={handleTextInputChange}
                placeholder="Type a message..."
                editable={true}
              />
              <View style={[styles.waveformAndTimer, isKeyboardVisible && { paddingBottom: 20 }]}>
              <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
              

                <OptimizedWaveform audioMetering={audioMetering} isPlaying={false} />
              </View>


              <View style={[styles.controlButtons, isKeyboardVisible && { paddingBottom: 20 }]}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={deleteRecording}
                >
                  <AntDesign name="delete" size={30} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={isPaused ? resumeRecording : pauseRecording}
                >
                  <AntDesign
                    name={isPaused ? "playcircleo" : "pausecircleo"}
                    size={30}
                    color="red"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={playMergedAudio}
                >
                  <AntDesign
                    name={'play'}
                    size={30}
                    color="red"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={ handleSendPress}
                >
                <MaterialCommunityIcons name={"send-circle"} size={40} color="green" />
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
                <View
                  style={[
                    styles.recordingActiveArea,
                    isKeyboardVisible && null,
                  ]}
                >
                
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


              {!isRecordingLocked && (
                <>
                  <Animated.Text style={[styles.slideToCancelText, animatedSlideToCancelStyle]}>
                  Slide to Cancel {'>'}
                  </Animated.Text>
                    </>
                  )}
                </View>
              )}
  
              {message.trim() ? (
                <TouchableOpacity onPress={handleSendPress} style={styles.iconButton}>
                  <MaterialCommunityIcons name="send-circle" size={40} color="green" />
                  </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPressIn={handleLongPress}
                >
                  <Feather name="mic" size={28} color="black" />
                </TouchableOpacity>
              )}
  
              <View
                style={[
                  styles.audioButtonContainer,
                  isKeyboardVisible && null,
                ]}
              >
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
    justifyContent: "center",
  },
  waveformBar: {
    width: 2,
    marginHorizontal: 0.9,
    borderRadius: 2,
  },
  wave: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    justifyContent: "flex-end",
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
});
