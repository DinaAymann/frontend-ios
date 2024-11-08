import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Alert,
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
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
  const [isRequesting, setIsRequesting] = useState(false);
  const [resendTimer, setResendTimer] = useState(50);
  const [canResend, setCanResend] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const contentAnimation = useRef(new Animated.Value(0)).current;
  const [backgroundColor, setBackgroundColor] = useState(colors.white);
  const RTL_LANGUAGES = ["ar-EG", "ar-AM", "fa-IR"];
  const textAlign = RTL_LANGUAGES.includes(language) ? "right" : "left";
  const { language } = useContext(LanguageContext);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const contentOffset = useRef(new Animated.Value(0)).current;

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
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        const keyboardHeight = event.endCoordinates.height;
        setKeyboardHeight(keyboardHeight);
        Animated.timing(contentOffset, {
          toValue: -keyboardHeight/3,
          duration: Platform.OS === 'ios' ? 250 : 0,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        Animated.timing(contentOffset, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 250 : 0,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);
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
      style: "default",
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
  
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboardAndDropdown}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? -60 : 20}
      >
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              transform: [{ translateY: contentOffset }]
            }
          ]}
        >
          <View style={styles.headerContainer}>
            <Typography
              text={t("register.title")}
              color={colors.black}
              size={40}
              fontWeight="700"
              fontFamily="Raleway"
              style={styles.title}
              top={40}
            />

            <Typography
              text={t("register.body")}
              color={colors.black}
              size={24}
              fontWeight="400"
              fontFamily="Raleway"
              style={styles.body}
              top={20}
            />
          </View>

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

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.sendCodeButton,
                { backgroundColor: phoneNumber ? colors.black : '#00000080' },
              ]}
              onPress={sendCode}
              disabled={!phoneNumber}
            >
              <Typography
                text={t("register.sendCode")}
                color={colors.white}
                fontFamily="Raleway"
                size={24}
                fontWeight="700"
                top={-3}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    marginBottom: 20,
  },
  body: {
    marginBottom: 40,
  },
  countryPickerContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 50,
    zIndex: 1,
  },
  buttonContainer: {
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  sendCodeButton: {
    padding: 15,
    marginHorizontal: 70,
    borderRadius: 10,
    backgroundColor: colors.purple,
    width: '70%',
    height: 65,
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default RegisterScreen;

