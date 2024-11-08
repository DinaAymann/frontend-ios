import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import i18n from "../i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../styles/colors";
import Typography from "../components/Typography";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../components/LanguageContext";

const OnBoardProfileScreen = ({ route }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);
  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const { language } = useContext(LanguageContext);
  const RTL_LANGUAGES = ["ar-EG", "ar-AM", "fa-IR"];
  const textAlign = RTL_LANGUAGES.includes(language) ? "right" : "left";
  
  const [focusedInput, setFocusedInput] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === "set") {
      setDate(selectedDate);
    }
  };

  const handleScreenPress = () => {
    Keyboard.dismiss();
    setShowDatePicker(false);
  };
  
  const formattedDate = date ? date.toLocaleDateString() : "";

  const isFormValid = name && date;

  const handleGoPress = async () => {
    if (isFormValid) {
      try {
        navigation.navigate("ChatListScreen");
      } catch (error) {
        console.error("Error saving language to AsyncStorage:", error);
        Alert.alert("Error", "Failed to save language preference");
      }
    }
  };

  const getInputStyle = (inputName) => {
    let value;
    switch (inputName) {
      case 'name':
        value = name;
        break;
      case 'nickname':
        value = nickname;
        break;
      case 'gender':
        value = gender;
        break;
      case 'date':
        value = date;
        break;
      default:
        value = '';
    }

    return [
      styles.input,
      focusedInput === inputName && styles.inputFocused,
      value && styles.inputFilled,
    ];
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled
    >
      <TouchableWithoutFeedback onPress={handleScreenPress}>
        <ScrollView 
          contentContainerStyle={[
            styles.scrollViewContent,
            keyboardVisible && styles.scrollViewWithKeyboard
          ]}
        >
          <View style={styles.inner}>
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} />
              ) : (
                <View style={styles.defaultImage}>
                  <Typography
                    text={t("onBoardProfile.photo")}
                    color={colors.black}
                    size={20}
                  />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputsContainer}>
              <TextInput
                style={getInputStyle('name')}
                placeholder={t("onBoardProfile.name")}
                placeholderTextColor={colors.grey3}
                value={name}
                onChangeText={setName}
                maxLength={20}
                textAlign={textAlign}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
              />
              <TextInput
                style={getInputStyle('nickname')}
                placeholder={t("onBoardProfile.nickname")}
                placeholderTextColor={colors.grey3}
                value={nickname}
                onChangeText={setNickname}
                maxLength={15}
                textAlign={textAlign}
                onFocus={() => setFocusedInput('nickname')}
                onBlur={() => setFocusedInput(null)}
              />
              <TextInput
                style={getInputStyle('gender')}
                placeholder={t("onBoardProfile.gender")}
                placeholderTextColor={colors.grey3}
                value={gender}
                onChangeText={setGender}
                maxLength={10}
                textAlign={textAlign}
                onFocus={() => setFocusedInput('gender')}
                onBlur={() => setFocusedInput(null)}
              />

              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                style={getInputStyle('date')}
              >
                <Text 
                  style={[
                    styles.dateText,
                    !date && styles.placeholderText
                  ]}
                >
                  {date ? formattedDate : "MM/DD/YYYY"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={onDateChange}
                />
              )}

              <TouchableOpacity 
                style={[styles.button, !isFormValid && styles.buttonDisabled]}
                onPress={handleGoPress}
                disabled={!isFormValid}
              >
                <Typography
                  text={t("onBoardProfile.submit")}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  inner: {
    flex: 1,
    marginHorizontal: 40,
    backgroundColor: colors.white,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  scrollViewWithKeyboard: {
    paddingBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 100,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 140,
  },
  defaultImage: {
    width: 200,
    height: 200,
    borderRadius: 140,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  inputsContainer: {
    gap: 15,
    alignItems: "center",
  },
  input: {
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#00000099',
    fontWeight: "400",
    fontFamily: "Raleway",
    width: 326,
    height: 40,
    marginHorizontal: 10,
    justifyContent: 'center',
    marginVertical: 5,
  },
  inputFocused: {
    borderWidth: 3,
    opacity: 0.6,
  },
  inputFilled: {
    borderWidth: 2,
    opacity: 0.6,
  },
  dateText: {
    fontSize: 14,
    paddingHorizontal: 1,
  },
  placeholderText: {
    color: colors.grey3,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 35,
    backgroundColor: '#000000',
    width: 280,
    height: 50,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#00000099',
  },
});

export default OnBoardProfileScreen;