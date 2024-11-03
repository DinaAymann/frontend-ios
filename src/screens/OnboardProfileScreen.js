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
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const { language } = useContext(LanguageContext);
  const RTL_LANGUAGES = ["ar-EG", "ar-AM", "fa-IR"];
  const textAlign = RTL_LANGUAGES.includes(language) ? "right" : "left";

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
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    }
    setShowDatePicker(false);
  };
  const formattedDate = date.toLocaleDateString();

  const handleGoPress = async () => {
    try {
      navigation.navigate("ChatListScreen");
    } catch (error) {
      console.error("Error saving language to AsyncStorage:", error);
      Alert.alert("Error", "Failed to save language preference");
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
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

            <TextInput
              style={styles.input}
              placeholder={t("onBoardProfile.name")}
              placeholderTextColor={colors.grey3}
              value={name}
              onChangeText={setName}
              maxLength={20}
              textAlign={textAlign}
            />
            <TextInput
              style={styles.input}
              placeholder={t("onBoardProfile.nickname")}
              placeholderTextColor={colors.grey3}
              value={nickname}
              onChangeText={setNickname}
              maxLength={15}
              textAlign={textAlign}
            />
            <TextInput
              style={styles.input}
              placeholder={t("onBoardProfile.gender")}
              placeholderTextColor={colors.grey3}
              value={gender}
              onChangeText={setGender}
              maxLength={10}
              textAlign={textAlign}
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#aaa"
                value={formattedDate}
                editable={false}
                pointerEvents="none"
                textAlign={textAlign}
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={onDateChange}
              />
            )}

            <TouchableOpacity style={styles.button} onPress={handleGoPress}>
              <Typography
                text={t("onBoardProfile.submit")}
                color={colors.white}
              />
            </TouchableOpacity>
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
    justifyContent: "space-evenly",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 140,
  },
  defaultImage: {
    width: 180,
    height: 180,
    borderRadius: 140,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    padding: 10,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.purple,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 50,
    backgroundColor: colors.purple,
  },
});

export default OnBoardProfileScreen;
