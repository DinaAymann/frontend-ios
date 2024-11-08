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
  const { t } = useTranslation();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(50);
  const [canResend, setCanResend] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const contentAnimation = useRef(new Animated.Value(0)).current;
  const phoneImageAnimation = useRef(new Animated.Value(height)).current;
  const inputRefs = useRef([]);

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

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "position" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={-40}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.white }}
        bounces={false}
      >
        <View style={styles.firstContainer}>
          <Typography
            text={`${t("codeConfirmation.body")} ${callingCode} ${phoneNumber}`}
            textAlign="center"
            size={24}
            fontFamily="Raleway"
            fontWeight="700"
            top={100}
          />

          <Typography
            text={t("codeConfirmation.title")}
            style={styles.titleText}
            textAlign="center"
            color={colors.black}
            size={24}
            fontFamily="Raleway"
            top={60}
            fontWeight="400"
          />

          <View style={styles.codeInputContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                value={digit}
                onChangeText={(value) => handleChangeText(index, value)}
                onKeyPress={({ nativeEvent }) => {
                  handleKeyPress(index, nativeEvent.key);
                }}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                style={[
                  styles.codeInput,
                  focusedIndex === index && styles.focusedCodeInput,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                ref={(ref) => (inputRefs.current[index] = ref)}
                editable={true}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={resendCode}
            disabled={!canResend}
            style={styles.resendTextButton}
          >
            <Text
              style={[
                styles.resendText,
                !canResend && styles.resendTextDisabled,
              ]}
            >
              {canResend
                ? t("codeConfirmation.reSendCode")
                : `${t("codeConfirmation.reSendinCode")} ${resendTimer}s`}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.secondContainer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              isCodeComplete && { backgroundColor: colors.black },
            ]}
            onPress={handleConfirm}
            disabled={!isCodeComplete}
          >
            <Typography
              text={t("codeConfirmation.confirmButton")}
              color={colors.white}
              size={24}
              fontFamily="Raleway"
              fontWeight="700"
              top={-3}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  firstContainer: {
    justifyContent: "center",
    paddingHorizontal: 30,
    alignItems: "center",
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 60,
  },
  codeInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    color: colors.black,
    fontSize: 24,
    textAlign: "center",
    backgroundColor: colors.white,
    fontWeight: "300",
    marginHorizontal: 5,
  },
  focusedCodeInput: {
    borderWidth: 3,
    opacity: 0.6,
  },
  confirmButton: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 220,
    marginHorizontal: 70,
    backgroundColor: "#00000080",
    width: 290,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  resendTextButton: {
    marginTop: 20,
  },
  resendText: {
    color: colors.black,
    textDecorationLine: 'underline',
    fontSize: 14,
    fontFamily: 'Raleway',
  },
  resendTextDisabled: {
    opacity: 0.5,
  },
  secondContainer: {
    alignItems: 'center',
  },
});

export default VerifyScreen;