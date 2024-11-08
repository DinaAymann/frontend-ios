import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import MessageBubble from "../components/ReusableBubbleMessage";
import ChatInputArea from "../components/ChatInputArea";
import { useChat } from "../components/ChatContext";
import SingleChatHeader from "../components/Headers/SingleChatHeader";
import { useNavigation } from "@react-navigation/native";
import i18n from "../i18n";

const ChatScreen = ({ route }) => {
  const { chatId, groupMembers, title, isGroupChat, selectedChats } =
    route.params;
  const { chats, sendMessage, sendAudio } = useChat();
  const chat = chatId ? chats.find((c) => c.id === chatId) : { messages: [] };
  const [message, setMessage] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  const chatTitle = isGroupChat ? title : chat?.user || "Chat";
  const profilePhotoUrl = isGroupChat
    ? "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"
    : chat?.profilePhotoUrl;

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(chatId, message, isGroupChat ? groupMembers : null);
      setMessage("");
    }
  };

  const handleSendAudio = (audioUri, lockRecording, isSwipingUp) => {
    if (!lockRecording && !isSwipingUp) {
      sendAudio(chatId, audioUri);
    } else {
      console.log("Recording is locked or still swiping, not sending audio.");
    }
  };

  const handleTitlePress = () => {
    navigation.navigate("GroupInfoScreen", {
      selectedChats: selectedChats,
    });
  };

  return (
    <View style={styles.container}>
      <SingleChatHeader
        navigation={navigation}
        title={chatTitle}
        profilePhotoUrl={profilePhotoUrl}
        onTitlePress={handleTitlePress}
      />

      <FlatList
        data={chat.messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <MessageBubble
            isOutgoing={item.isOutgoing}
            message={item.text}
            timestamp={item.timestamp}
            type={item.type}
          />
        )}
        inverted={true}
        style={styles.messagesContainer}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ChatInputArea
          onSendPress={handleSend}
          onSendAudio={handleSendAudio}
          setMessage={setMessage}
          message={message}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  messagesContainer: {
    paddingHorizontal: 10,
  },
});

export default ChatScreen;
