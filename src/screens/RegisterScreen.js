import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Image,
  Dimensions,
} from "react-native";
import CountryPicker from "../components/CountryPicker";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import colors from "../styles/colors";
import Typography from "../components/Typography";
import { LanguageContext } from "../components/LanguageContext";
const { width } = Dimensions.get("window");

const RegisterScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [callingCode, setCallingCode] = useState("+20");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [resendTimer, setResendTimer] = useState(50);
  const [canResend, setCanResend] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const contentAnimation = useRef(new Animated.Value(0)).current;
  const [backgroundColor, setBackgroundColor] = useState(colors.white);
  const RTL_LANGUAGES = ["ar-EG", "ar-AM", "fa-IR"];
  const textAlign = RTL_LANGUAGES.includes(language) ? "right" : "left";
  const { language } = useContext(LanguageContext);

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

  useEffect(() => {
    Animated.sequence([
      Animated.timing(contentAnimation, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnimation, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validatePhoneNumber = (phoneNumber, callingCode) => {
    if (!phoneNumber || !callingCode) return false;
    const fullNumber = callingCode + phoneNumber;
    const parsedNumber = parsePhoneNumberFromString(fullNumber);
    return parsedNumber && parsedNumber.isValid();
  };

  const sendCode = async () => {
    const fullNumber = callingCode + phoneNumber.replace(/\s+/g, "");
    const parsedNumber = parsePhoneNumberFromString(fullNumber);

    if (!parsedNumber || !parsedNumber.isValid()) {
      Alert.alert(t("invalidNumAlert.title"), t("invalidNumAlert.body"));
      return;
    }

    const formattedPhoneNumber = parsedNumber.formatInternational();
    Alert.alert(
      t("alertConfirm.title"),
      `${t("alertConfirm.body")} ${formattedPhoneNumber}`,
      [
        {
          text: t("verification.cancelText"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("verification.okText"),
          onPress: async () => {
            setIsRequesting(true);
            try {
              navigation.navigate("VerifyScreen", {
                verificationId,
                phoneNumber,
                callingCode,
              });
            } catch (error) {
              alert(error.message);
            } finally {
              setIsRequesting(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const dismissKeyboardAndDropdown = () => {
    Keyboard.dismiss();
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
  };

  const changeBackgroundColor = (toColor) => {
    Animated.timing(contentAnimation, {
      toValue: toColor === colors.grey ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setBackgroundColor(toColor);
    });
  };

  const handleGoBack = () => {
    changeBackgroundColor(colors.grey);
    setTimeout(() => changeBackgroundColor(colors.white), 300);
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboardAndDropdown}>
      <View style={[styles.container, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.animatedContainer,
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
          <View style={styles.firstContainer}>
            <Animated.Image
              source={require("../assets/phone.jpg")}
              style={[
                styles.image,
                {
                  transform: [
                    {
                      translateX: contentAnimation,
                    },
                  ],
                },
              ]}
            />

            <Typography
              text={t("register.title")}
              color={colors.purple}
              size={30}
            />

            <Typography
              text={t("register.body")}
              color={colors.black}
              size={18}
            />

            <View style={styles.countryPickerContainer}>
              <CountryPicker
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                setCallingCode={setCallingCode}
                dropdownVisible={dropdownVisible}
                setDropdownVisible={setDropdownVisible}
                language={language}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.sendCodeButton,
              { backgroundColor: phoneNumber ? colors.purple : colors.grey },
            ]}
            onPress={() => {
              sendCode();
            }}
            disabled={!phoneNumber}
          >
            <Typography
              text={t("register.sendCode")}
              color={colors.white}
              padding={24}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  animatedContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  firstContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  countryPickerContainer: {
    flex: 1,
    marginTop: 20,
  },
  image: {
    flex: 0.5,
    width: 150,
    resizeMode: "contain",
    alignSelf: "center",
  },
  sendCodeButton: {
    padding: 20,
    marginHorizontal: 70,
    marginVertical: 20,
    borderRadius: 25,
    backgroundColor: colors.purple,
  },
});

export default RegisterScreen;
