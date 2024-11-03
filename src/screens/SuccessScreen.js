import React, { useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import colors from "../styles/colors";
import i18n from "../i18n";
import Typography from "../components/Typography";
import { LanguageContext } from "../components/LanguageContext";
const SuccessScreen = ({ navigation, route }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNavigateToChatList = () => {
    navigation.navigate("OnBoardProfileScreen");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Animated.Image
            source={require("../assets/Success.png")}
            style={[{ transform: [{ scale: scaleValue }] }]}
          />
          <View style={{ marginHorizontal: 45 }}>
            <Typography
              text={t("success.body")}
              color={colors.black}
              size={30}
            />
          </View>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <TouchableOpacity
            style={styles.button}
            onPress={handleNavigateToChatList}
          >
            <Typography
              text={t("success.confirmButton")}
              color={colors.white}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

SuccessScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      currentStep: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.purple,
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
});

export default SuccessScreen;
