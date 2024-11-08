import React, { useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import colors from "../styles/colors";
import Typography from "../components/Typography";
import { LanguageContext } from "../components/LanguageContext";

const SuccessScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const navigationTimer = setTimeout(() => {
      navigation.replace("OnBoardProfileScreen");
    }, 1000); 

    return () => {
      clearTimeout(navigationTimer);
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
          <Typography
              text={t("success.title")}
              color={colors.black}
              size={24}
              fontFamily="Raleway" 
              fontWeight="700"
            />
            <Typography
              text={t("success.body")}
              color={colors.black}
              size={24}
              fontFamily="Raleway" 
              top={20}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

SuccessScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  textContainer: {
    marginHorizontal: 25,
    top: -150,
  },
});

export default SuccessScreen;