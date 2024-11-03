import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import colors from "../../styles/colors";
import Typography from "../Typography";
import { useChat } from "../ChatContext";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../LanguageContext";

const ConfirmHeader = ({
  closeModal,
  reopenOldModal,
  selectedChatCount,
  setCreateGroupVisible,
}) => {
  const { chats, clearSelectedChats } = useChat();
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation();

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

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => {
          clearSelectedChats();
          closeModal();
          reopenOldModal(false);
        }}
      >
        <Typography
          text={t("secondModal.cancel")}
          color={colors.grey2}
          size={20}
        />
      </TouchableOpacity>
      <View style={styles.columnContainer}>
        <Typography
          text={t("secondModal.title")}
          color={colors.grey2}
          size={20}
        />
        <Typography
          text={`${selectedChatCount}/${chats.length}`}
          color={colors.grey2}
          size={15}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          if (selectedChatCount > 0) {
            closeModal();
            setCreateGroupVisible(true);
          } else {
            Alert.alert(t("membersAlert.title"), t("membersAlert.body"), [
              {
                text: t("membersAlert.button"),
                onPress: () => console.log(t("membersAlert.body")),
              },
            ]);
          }
        }}
      >
        <Typography
          text={t("secondModal.Next")}
          color={colors.grey2}
          size={20}
          textAlign={textAlign}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  columnContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 40,
  },
});

export default ConfirmHeader;
