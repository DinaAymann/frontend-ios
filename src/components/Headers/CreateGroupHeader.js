import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../styles/colors";
import { LanguageContext } from "../LanguageContext";
import Typography from "../Typography";
import { useNavigation } from "@react-navigation/native";
import { useChat } from "../ChatContext";
import { useTranslation } from "react-i18next";

const CreateGroupHeader = ({ closeModal, value, onCloseGroup }) => {
  const { selectedChatIds, chats, clearSelectedChats } = useChat();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);
  const RTL_LANGUAGES = ["ar-EG", "ar-AM", "fa-IR"];
  const textAlign = RTL_LANGUAGES.includes(language) ? "right" : "left";
  const rowDirection = RTL_LANGUAGES.includes(language) ? "row-reverse" : "row";
  const iconPadding = RTL_LANGUAGES.includes(language)
    ? { paddingLeft: 10 }
    : { paddingRight: 10 };
  const iconRotation = RTL_LANGUAGES.includes(language)
    ? { transform: [{ rotate: "180deg" }] }
    : { transform: [{ rotate: "0deg" }] };
  const aligntext = RTL_LANGUAGES.includes(language)
    ? { alignItems: "flex-end" }
    : { alignItems: "flex-start" };

  const selectedChats = chats.filter((chat) =>
    selectedChatIds.includes(chat.id)
  );
  const handleCreateGroup = () => {
    if (selectedChats.length > 0) {
      const groupMembers = selectedChats.map((chat) => ({
        id: chat.id,
        userName: chat.user,
        profilePhotoUrl: chat.profilePhotoUrl,
      }));

      onCloseGroup;

      navigation.navigate("ChatInputArea", {
        chatId: null,
        isGroupChat: true,
        groupMembers,
        title: value || "Untitled Group",
        selectedChats,
      });
      closeModal();
    } else {
      console.log("No members selected!");
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => {
          clearSelectedChats();
          closeModal();
        }}
      >
        <Typography
          text={t("thirdModal.back")}
          color={colors.black}
          size={20}
        />
      </TouchableOpacity>
      <Typography text={t("thirdModal.title")} color={colors.black} size={20} />
      <TouchableOpacity
        onPress={() => {
          handleCreateGroup();
          clearSelectedChats();
        }}
      >
        <Typography
          text={t("thirdModal.create")}
          color={colors.black}
          size={20}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CreateGroupHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
});
