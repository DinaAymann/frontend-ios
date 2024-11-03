import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { Alert, I18nManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "../locales/en-US/translation.json";
import translationEg from "../locales/ar-EG/translation.json";
import translationFr from "../locales/fr-FR/translation.json";
import translationOm from "../locales/om-ET/translation.json";
import translationAm from "../locales/am-ET/translation.json";
import translationIr from "../locales/fa-IR/translation.json";
import translationHa from "../locales/ha-NG/translation.json";
import translationPt from "../locales/pt-PT/translation.json";
import translationKe from "../locales/sw-KE/translation.json";
import translationTr from "../locales/tr-TR/translation.json";
import translationZa from "../locales/zu-ZA/translation.json";
import translationIg from "../locales/ig-NG/translation.json";
import translationFc from "../locales/fc-FC/translation.json";
import translationAr from "../locales/ar-AM/translation.json";

const resources = {
  "en-US": { translation: translationEn },
  "fr-FR": { translation: translationFr },
  "ar-EG": { translation: translationEg },
  "fc-FC": { translation: translationFc },
  "om-ET": { translation: translationOm },
  "am-ET": { translation: translationAm },
  "fa-IR": { translation: translationIr },
  "ha-NG": { translation: translationHa },
  "pt-PT": { translation: translationPt },
  "sw-KE": { translation: translationKe },
  "tr-TR": { translation: translationTr },
  "zu-ZA": { translation: translationZa },
  "ig-NG": { translation: translationIg },
  "ar-AM": { translation: translationAr },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources,
  fallbackLng: "en-US",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

const rtlLanguages = ["ar-EG", "ar-AM", "fa-IR"];

export const initializeI18n = async () => {
  try {
    let savedLanguage = await AsyncStorage.getItem("language");

    if (!savedLanguage) {
      const deviceLocales = Localization.getLocales();
      if (deviceLocales && deviceLocales.length > 0) {
        const deviceLanguage = deviceLocales[0].languageCode;
        savedLanguage = resources[`${deviceLanguage}-EG`]
          ? `${deviceLanguage}-EG`
          : resources[`${deviceLanguage}-FR`]
          ? `${deviceLanguage}-FR`
          : "en-US";
      } else {
        savedLanguage = "en-US";
      }
    }

    if (savedLanguage.startsWith("ar")) {
      if (!I18nManager.isRTL) {
        I18nManager.forceRTL(true);
      }
    } else {
      if (I18nManager.isRTL) {
        I18nManager.forceRTL(false);
      }
    }

    await i18n.changeLanguage(savedLanguage);
    await AsyncStorage.setItem("language", savedLanguage);
  } catch (error) {
    console.error("Failed to initialize language:", error);
    await i18n.changeLanguage("en-US");
  }
};

export default i18n;
