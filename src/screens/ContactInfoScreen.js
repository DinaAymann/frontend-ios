import React, { useState, useContext } from "react";
import { StyleSheet, ScrollView, Platform } from "react-native";
import colors from "../styles/colors";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../components/LanguageContext";
import IOSMessageInfo from "../components/SingleChatInfo/IOSMessageInfo";
import AndroidMessageInfo from "../components/SingleChatInfo/AndroidMessageInfo";

const ContactInfoScreen = ({ route }) => {
  const { userProfilePhoto, userName } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
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

  return (
    <ScrollView style={styles.scrollContainer}>
      {Platform.OS === "ios" ? (
        <IOSMessageInfo
          userProfilePhoto={userProfilePhoto}
          userName={userName}
        />
      ) : (
        <AndroidMessageInfo
          userProfilePhoto={userProfilePhoto}
          userName={userName}
        />
      )}
    </ScrollView>
  );
};

export default ContactInfoScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: colors.white,
  },
});
