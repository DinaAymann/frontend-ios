import React, { createContext, useState, useEffect } from "react";
import i18n from "../i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the context
export const LanguageContext = createContext({
  language: "en", // default value
  changeLanguage: () => {},
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // default to English

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("appLanguage");
      if (savedLanguage) {
        setLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, []);

  // Function to change the language and persist it
  const changeLanguage = async (language) => {
    setLanguage(language);
    i18n.changeLanguage(language);
    await AsyncStorage.setItem("appLanguage", language); // persist the language choice
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
