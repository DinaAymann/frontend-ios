import React, { useState, useEffect, useContext } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useChat } from "../components/ChatContext";
import colors from "../styles/colors";
import ReusableHeader from "../components/Headers/ReusableHeader";
import AndroidHeader from "../components/Headers/AndroidHeader";
import GroupChatModal from "../components/Modals/GroupChatModal";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import Typography from "../components/Typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AndroidWhatsappModal from "../components/Modals/AndroidWhatsappModal";
import { LanguageContext } from "../components/LanguageContext";
const ChatListScreen = ({ navigation, route }) => {
  const { chats, openModal, closeModal, isModalVisible } = useChat();
  const { t } = useTranslation();
  const [isAndroidModalVisible, setAndroidModalVisible] = useState(false);
  const RTL_LANGUAGES = ["ar-EG", "ar-AM", "fa-IR"];
  const textAlign = RTL_LANGUAGES.includes(language) ? "right" : "left";
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  const toggleModal = () => {
    setAndroidModalVisible(!isAndroidModalVisible);
  };

  const closeAndroidModal = () => {
    setAndroidModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" ? (
        <>
          <ReusableHeader
            title={t("chatList.title")}
            onAddPress={() => {
              Platform.OS === "ios" ? openModal() : console.log("Pressed");
            }}
            showCloseIcon={false}
          />
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  navigation.navigate("ChatInputArea", {
                    chatId: item.id,
                    userName: item.user,
                    userProfilePhoto: item.profilePhotoUrl,
                  })
                }
              >
                <Image
                  source={{ uri: item.profilePhotoUrl }}
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Typography
                    text={item.user}
                    textAlign="flex-start"
                    fontFamily="Cairo-Regular"
                    size={16}
                  />
                  <Typography
                    text={item.lastMessage || "No messages yet"}
                    color={colors.grey2}
                    textAlign="flex-start"
                    fontFamily="Cairo-Regular"
                  />
                </View>
                <Typography text={item.time} color={colors.grey3} size={10} />
              </TouchableOpacity>
            )}
          />
          <GroupChatModal
            isVisible={isModalVisible}
            closeModal={closeModal}
            data={chats}
          />
        </>
      ) : (
        <View style={styles.androidContainer}>
          <AndroidHeader
            title={`${t("chatList.title")}`}
            onDotsPress={toggleModal}
          />
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  navigation.navigate("ChatInputArea", {
                    chatId: item.id,
                    userName: item.user,
                    userProfilePhoto: item.profilePhotoUrl,
                  })
                }
              >
                <Image
                  source={{ uri: item.profilePhotoUrl }}
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Typography
                    text={item.user}
                    textAlign="flex-start"
                    fontFamily="Cairo-Regular"
                    size={16}
                  />
                  <Typography
                    text={item.lastMessage || "No messages yet"}
                    color={colors.grey2}
                    textAlign="flex-start"
                    fontFamily="Cairo-Regular"
                  />
                </View>
                <Typography text={item.time} color={colors.grey3} size={10} />
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => openModal()}>
            <View style={styles.newChatContainer}>
              <MaterialCommunityIcons
                name="message-plus"
                size={22}
                color={colors.white}
              />
            </View>
          </TouchableOpacity>
          <GroupChatModal
            isVisible={isModalVisible}
            closeModal={closeModal}
            data={chats}
          />
          <Modal
            transparent={true}
            visible={isAndroidModalVisible}
            animationType="fade"
            onRequestClose={toggleModal}
          >
            <TouchableWithoutFeedback onPress={closeAndroidModal}>
              <View style={styles.modalContent}>
                <AndroidWhatsappModal closeModal={closeAndroidModal} />
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  item: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  androidContainer: {
    flex: 1,
  },
  newChatContainer: {
    zIndex: 1,
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: colors.purple,
    bottom: "15%",
    right: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "90deg" }],
  },
  modalContent: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    padding: 5,
  },
});

export default ChatListScreen;
