import React, { useState, useCallback, useContext } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Alert,
  I18nManager,
} from "react-native";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../styles/colors";
import Typography from "../components/Typography";
import { LanguageContext } from "../components/LanguageContext";
import Checkbox from "../components/CheckBox";

const { width } = Dimensions.get("window");
const RTL_LANGUAGES = ["ar-EG", "ar-AM", "fa-IR"];
const DATA = ["English", "مصري", "Franco"];
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
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const { t } = useTranslation();
  const { language, changeLanguage } = useContext(LanguageContext);
  const [currentLanguage, setCurrentLanguage] = useState("en-US");

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

  const handleLanguagePress = async (index) => {
    setSelectedIndex(index);
    const selectedLanguage = DATA[index];
    const languageCode = languageMapping[selectedLanguage] || "en-US";
    changeLanguage(languageCode);
    if (RTL_LANGUAGES.includes(languageCode)) {
      I18nManager.forceRTL(true);
      setCurrentLanguage(languageCode);
    } else {
      I18nManager.forceRTL(false);
      setCurrentLanguage(languageCode);
    }
    setForceRender((prev) => !prev);
  };

  let logoSource;
  
  if (language === "en-US" || language === "fr-FR") {
    logoSource = require("../assets/EnglishLogo.png");
  } else if (language === "ar-AM" || language === "ar-EG") {
    logoSource = require("../assets/ArabicLogo.png");
  } else if (language === "fc-FC") {
    logoSource = require("../assets/EnglishLogo.png");
  }
  
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
          source={logoSource}
          style={styles.logo}
          resizeMode="contain" 
          animated={true}
        />
      
        <Typography
          text={t("home.welcome")}
          style={{ textAlign }}
          padding={20}
          top={10}
          size={24}    
          fontFamily="Raleway"
          fontWeight="400" 
          width='90%'     
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
        </View>

        <View style={styles.listContainer}>
          {DATA.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.itemContainer, selectedIndex === index && styles.selectedItem]}
              onPress={() => handleLanguagePress(index)}
            >
              <Typography
                text={item}
                color={selectedIndex === index ? colors.white : colors.black}
                style={[styles.itemText, selectedIndex === index && styles.selectedText]}
                size={24}
                fontFamily="Raleway"
                fontWeight="400"
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.startButton,
            { backgroundColor: isChecked ? colors.black : '#00000080' }, 
          ]}
          onPress={handleStartPress}
          disabled={!isChecked}
        >
          <Typography
            text={t("home.startButton")}
            color={colors.white}
            size={40}
            fontWeight="700"
            fontFamily="Raleway"
            top={-5}
          />
        </TouchableOpacity>

        <View style={styles.termsContainer}>
          <Checkbox
            isChecked={isChecked}
            onPress={() => setIsChecked(!isChecked)} 
          />
          <Typography
            text={t("home.terms")}
            size={14}
            paddingTop={10}
            fontWeight="300"
            fontFamily="Raleway"
            right={5}
            left={5}
            style={{ textAlign }}
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
  itemContainer: {
    width: width / 5,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.black,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  selectedItem: {
    borderColor: colors.black,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: colors.black,
  },
  itemText: {
    fontSize: 24,
  },
  selectedText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  logo: {
    width: 122,
    height: 169,
    marginTop: 137,
  },
  startButton: {
    width: "90%",
    height: 60,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default WelcomeScreen;