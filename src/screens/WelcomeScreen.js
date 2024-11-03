import React, { useState, useCallback, useRef, useContext } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  Alert,
  I18nManager,
} from "react-native";
import PropTypes from "prop-types";
import { CheckBox } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import Typography from "../components/Typography";
import { LanguageContext } from "../components/LanguageContext";
const { width } = Dimensions.get("window");
// cosnt;
const RTL_LANGUAGES = ["ar-EG", "ar-AM", "fa-IR"];

const DATA = ["English", "مصري", "Franco", "Arabic", "French"];

const itemWidth = width / 4;

const languageMapping = {
  English: "en-US",
  Franco: "fc-FC",
  مصري: "ar-AM",
  Arabic: "ar-EG",
  French: "fr-FR",
};

const WelcomeScreen = ({ navigation, route }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  const flatListRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const buttonBackgroundColor = isChecked ? colors.purple : colors.lightGrey;
  const { t } = useTranslation();
  const { language, changeLanguage } = useContext(LanguageContext);

  const renderItem = ({ item, index }) => {
    const isSelected = index === selectedIndex;
    return (
      <TouchableOpacity
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
        onPress={() => handleLanguagePress(index)}
      >
        <Typography
          text={item}
          style={[styles.itemText, isSelected && styles.selectedText]}
        />
      </TouchableOpacity>
    );
  };
  useFocusEffect(
    useCallback(() => {
      const resetUI = async () => {
        setForceRender((prev) => !prev);
        setShowLeftArrow(false);
        setShowRightArrow(DATA.length > 1);
      };
      resetUI();
    }, [])
  );

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const totalWidth = (itemWidth + 10) * (DATA.length - 1);
    const currentScrollPosition = contentOffsetX + width;
    const index = Math.floor(contentOffsetX / (itemWidth + 11));
    setShowLeftArrow(index > 0);
    setShowRightArrow(currentScrollPosition < totalWidth - 1);
  };

  const handleBackPress = async () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedIndex(newIndex);
      flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
      await handleLanguagePress(newIndex);
    }
  };

  const handleForwardPress = async () => {
    if (selectedIndex < DATA.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedIndex(newIndex);
      flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
      setShowLeftArrow(newIndex > 0);
      setShowRightArrow(newIndex < DATA.length - 1);
      await handleLanguagePress(newIndex);
    }
  };

  const [currentLanguage, setCurrentLanguage] = useState("en-US");

  const handleLanguagePress = async (index) => {
    setSelectedIndex(index);
    const selectedLanguage = DATA[index];
    const languageCode = languageMapping[selectedLanguage] || "en-US";
    changeLanguage(languageCode);
    if (RTL_LANGUAGES.includes(languageCode)) {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
    setForceRender((prev) => !prev);
  };

  const handleStartPress = async () => {
    if (!isChecked) {
      Alert.alert(t("startAlert.title"), `${t("startAlert.body")}`);
      return;
    }
    const selectedLanguage = DATA[selectedIndex];
    const languageCode = languageMapping[selectedLanguage] || "en-US";
    await i18n.changeLanguage(languageCode);
    await AsyncStorage.setItem("language", languageCode);
    navigation.navigate("RegisterScreen");
  };
  const textAlign = RTL_LANGUAGES.includes(currentLanguage) ? "right" : "left";

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          animated={true}
        />
        <Typography
          text={t("home.title")}
          style={styles.welcomeTextEnglish}
          fontFamily="Cairo-Bold"
          size={64}
          color={colors.purple}
        />
        <Typography
          text={t("home.welcome")}
          style={[styles.smallText, { textAlign }]}
          padding={20}
        />

        <View style={styles.progressIndicatorContainer}>
          <View
            style={[
              {
                width: `${100 / DATA.length - 9}%`,
                transform: [{ translateX: selectedIndex * itemWidth }],
              },
            ]}
          />
          {DATA.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                selectedIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.listContainer}>
          {showLeftArrow && (
            <TouchableOpacity onPress={handleBackPress}>
              <Ionicons
                name="caret-back-outline"
                size={32}
                color={colors.purple}
                style={styles.iconLeftContainer}
              />
            </TouchableOpacity>
          )}

          <View style={styles.flatlistContainer}>
            <FlatList
              data={DATA}
              ref={flatListRef}
              horizontal
              renderItem={renderItem}
              keyExtractor={(item) => item}
              snapToAlignment="start"
              snapToInterval={itemWidth + 10}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              extraData={forceRender}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            />
          </View>
          {showRightArrow && (
            <TouchableOpacity onPress={handleForwardPress}>
              <Ionicons
                name="caret-forward-outline"
                size={32}
                color={colors.purple}
                style={styles.iconRightContainer}
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.startButton,
            { backgroundColor: buttonBackgroundColor },
          ]}
          onPress={handleStartPress}
          disabled={!isChecked}
        >
          <Typography
            text={t("home.startButton")}
            style={styles.buttonText}
            color={colors.white}
            size={20}
            marginTop={10}
          />
        </TouchableOpacity>

        <View style={styles.termsContainer}>
          <CheckBox
            checked={isChecked}
            onPress={() => setIsChecked(!isChecked)}
            containerStyle={styles.checkboxContainer}
            checkedColor={colors.purple}
          />
          <Typography
            text={t("home.terms")}
            style={styles.termsText}
            size={14}
            paddingTop={10}
          />
        </View>
      </View>
    </ScrollView>
  );
};

WelcomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: 10,
    fontSize: 1,
  },
  listContainer: {
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeftContainer: {
    paddingLeft: 10,
    marginHorizontal: 5,
  },
  iconRightContainer: {
    paddingRight: 10,
    marginHorizontal: 5,
  },

  flatlistContainer: {
    flex: 1,
  },

  itemContainer: {
    width: width / 4,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.lightGrey,
    marginHorizontal: 5,
    borderRadius: 4,
  },
  selectedItem: {
    borderColor: colors.purple,
  },
  itemText: {
    fontSize: 16,
  },
  selectedText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 70,
  },
  welcomeTextEnglish: {
    color: colors.purple,
    textAlign: "center",
  },
  smallText: {
    color: colors.darkGrey,
    paddingVertical: 10,
  },
  progressIndicatorContainer: {
    flexDirection: "row",
    paddingRight: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
    marginVertical: 25,
  },
  activeDot: {
    backgroundColor: colors.purple,
  },
  inactiveDot: {
    backgroundColor: colors.inactive,
  },
  startButton: {
    width: "80%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    marginRight: -5,
  },
  termsText: {
    color: colors.black,
    fontSize: 16,
  },
});

export default WelcomeScreen;
