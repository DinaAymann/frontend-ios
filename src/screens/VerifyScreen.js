import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  I18nManager,
} from "react-native";

import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../styles/colors";
import Typography from "../components/Typography";
import i18n from "../i18n";
import { LanguageContext } from "../components/LanguageContext";
const { width, height } = Dimensions.get("window");

const VerifyScreen = ({ navigation, route }) => {
  const { verificationId, phoneNumber, callingCode } = route.params;
  const { language } = useContext(LanguageContext);
  const recaptchaVerifier = useRef(null);
  const { t } = useTranslation();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(50);
  const [canResend, setCanResend] = useState(false);
  const contentAnimation = useRef(new Animated.Value(0)).current;
  const phoneImageAnimation = useRef(new Animated.Value(height)).current;
  const inputRefs = useRef([]);

  const RTL_LANGUAGES = ["ar-EG", "ar-AM", "fa-IR"];
  const textAlign = RTL_LANGUAGES.includes(language) ? "right" : "left";

  useEffect(() => {
    Animated.sequence([
      Animated.timing(contentAnimation, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnimation, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(phoneImageAnimation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem("userToken", token);
    } catch (e) {
      console.error("Failed to save the token to storage", e);
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleKeyPress = (index, key) => {
    if (key === "Backspace") {
      const newCode = [...code];
      if (newCode[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handleChangeText = (index, value) => {
    const newValue = value.replace(/[^0-9]/g, "");
    const newCode = [...code];
    newCode[index] = newValue;
    if (newValue.length > 0 && index < newCode.length - 1) {
      inputRefs.current[index + 1].focus();
    }
    if (newValue.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    setCode(newCode);
  };

  const handleConfirm = async () => {
    const enteredCode = code.join("");
    if (enteredCode.length === 6) {
      try {
        navigation.navigate("SuccessScreen", {
          currentStep: 4,
        });
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("Please enter the full 6-digit code.");
    }
  };

  const resendCode = async () => {
    setCanResend(false);
    setResendTimer(50);
    try {
      alert("Verification code resent.");
    } catch (error) {
      alert(`Error resending code: ${error.message}`);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Animated.View
          style={[
            styles.bodyContainer,
            {
              opacity: contentAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
              transform: [
                {
                  translateX: contentAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width / 4, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.Image
            source={require("../assets/otp.png")}
            style={[
              styles.phoneImage,
              {
                transform: [
                  {
                    translateX: phoneImageAnimation,
                  },
                ],
              },
            ]}
          />
          <View style={styles.firstContainer}>
            <Typography
              text={t("codeConfirmation.title")}
              style={styles.titleText}
              textAlign={textAlign}
              color={colors.purple}
              size={30}
              fontFamily="Cairo-Bold"
            />
            <Typography
              text={`${t(
                "codeConfirmation.body"
              )} \n${callingCode} ${phoneNumber}`}
              textAlign={textAlign}
              size={18}
              fontFamily="Cairo-Regular"
            />

            <View style={styles.codeInputContainer}>
              {code.map((digit, index) => (
                <React.Fragment key={index}>
                  <TextInput
                    value={digit}
                    onChangeText={(value) => handleChangeText(index, value)}
                    onKeyPress={({ nativeEvent }) => {
                      handleKeyPress(index, nativeEvent.key);
                    }}
                    style={styles.codeInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    editable={true}
                  />
                  {index === 2 && (
                    <View style={styles.hyphen}>
                      <Typography text={"-"} size={18} />
                    </View>
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          <View style={styles.secondContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Typography
                text={t("codeConfirmation.confirmButton")}
                color={colors.white}
                size={20}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resendButton, !canResend && { opacity: 0.5 }]}
              onPress={resendCode}
              disabled={!canResend}
            >
              <Typography
                text={
                  canResend
                    ? `${t("codeConfirmation.reSendCode")}`
                    : `${t("codeConfirmation.reSendinCode")} ${resendTimer}s`
                }
                color={colors.white}
                size={12}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: colors.white,
  },
  phoneImage: {
    width: 150,
    height: 150,
    alignSelf: "center",
    resizeMode: "contain",
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
    resizeMode: "contain",
  },
  firstContainer: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    color: colors.black,
    fontSize: 24,
    textAlign: "center",
    backgroundColor: colors.white,
    marginHorizontal: 3,
  },
  confirmButton: {
    padding: 10,
    borderRadius: 25,
    marginVertical: 10,
    marginHorizontal: 100,
    backgroundColor: colors.purple,
  },
  hyphen: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  resendButton: {
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 130,
    backgroundColor: colors.purple,
  },
});

export default VerifyScreen;
