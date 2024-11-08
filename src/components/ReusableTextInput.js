import React, { useContext } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../styles/colors";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "./LanguageContext";

const ReusableTextInput = ({ value, onChangeText }) => {
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
    <View style={[styles.container, { flexDirection: rowDirection }]}>
      <Ionicons
        name="search"
        size={20}
        color={colors.grey2}
        style={iconPadding}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t("firstModal.placeHolder")}
        placeholderTextColor={colors.grey}
        style={(styles.textInputContainer, textAlign)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderColor: colors.grey,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 30,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
  },
  textInputContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
});

export default ReusableTextInput;
