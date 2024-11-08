import React, { useEffect } from "react";
import {
  AppRegistry,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NhostClient, NhostProvider } from "@nhost/react";
import * as SecureStore from "expo-secure-store";
import { ApolloProvider } from "@apollo/client";
import {
  Cairo_400Regular,
  Cairo_600SemiBold,
  useFonts,
} from "@expo-google-fonts/cairo";
import ChatInputArea from "./src/components/ChatInputArea";
import ChatScreen from "./src/screens/ChatScreen";
import ChatListScreen from "./src/screens/ChatListScreen";
import LogoScreen from "./src/screens/LogoScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import SuccessScreen from "./src/screens/SuccessScreen";
import VerifyScreen from "./src/screens/VerifyScreen";
import { client } from "./src/chat-backend/services/apolloClient";
import { ChatProvider } from "./src/components/ChatContext";
import { name as appName } from "./app.json";
import { enableScreens } from "react-native-screens";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import OnBoardProfileScreen from "./src/screens/OnboardProfileScreen";
import GeneralSettingsScreen from "./src/screens/GeneralSettings";
import GroupInfoScreen from "./src/screens/GroupInfoScreen";
import ContactInfoScreen from "./src/screens/ContactInfoScreen";
import colors from "./src/styles/colors";
import { I18nextProvider } from "react-i18next";
import i18n, { initializeI18n } from "./src/i18n";
import { LanguageProvider } from "./src/components/LanguageContext";
enableScreens();
import { useTranslation } from "react-i18next";

const nhost = new NhostClient({
  subdomain: "ddddhshkcmplqkdeivjc",
  region: "eu-central-1",
  clientStorageType: "expo-secure-storage",
  clientStorage: SecureStore,
});

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator initialRouteName="WelcomeScreen">
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContactInfoScreen"
        component={ContactInfoScreen}
        options={{
          headerShown: true,
          headerTitle: "Contact Info",
          headerBackTitle: "Back",
          headerBackTitleVisible: true,
          headerShadowVisible: false,
          headerTintColor: colors.black,
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            shadowColor: "transparent",
          },
        }}
      />
      <Stack.Screen
        name="GroupInfoScreen"
        component={GroupInfoScreen}
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Back",
          headerBackTitleVisible: true,
          headerShadowVisible: false,
          headerTintColor: colors.black,
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            shadowColor: "transparent",
          },
        }}
      />
      <Stack.Screen
        name="ChatListScreen"
        component={ChatListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatInputArea"
        component={ChatInputArea}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GeneralSettingsScreen"
        component={GeneralSettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LogoScreen"
        component={LogoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        // options={{
        //   headerShown: true,
        //   headerTitle: "",
        //   headerBackTitle: "Back",
        //   headerBackTitleVisible: true,
        //   headerShadowVisible: false,
        //   headerTintColor: colors.black,
        //   headerStyle: {
        //     elevation: 0,
        //     shadowOpacity: 0,
        //     borderBottomWidth: 0,
        //     shadowColor: "transparent",
        //   },
        // }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyScreen"
        component={VerifyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SuccessScreen"
        component={SuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnBoardProfileScreen"
        component={OnBoardProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <SafeAreaView style={[styles.appContainer, styles.textStyle]}>
      <LanguageProvider>
        <I18nextProvider i18n={i18n}>
          <NhostProvider nhost={nhost}>
            <ApolloProvider client={client}>
              <ChatProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <NavigationContainer>
                    <AppNavigator />
                  </NavigationContainer>
                </GestureHandlerRootView>
              </ChatProvider>
            </ApolloProvider>
          </NhostProvider>
        </I18nextProvider>
      </LanguageProvider>
    </SafeAreaView>
  );
};

AppRegistry.registerComponent(appName, () => App);

export default App;

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },
  textStyle: {
    fontWeight: Platform.OS === "ios" ? "600" : "thin",
    textAlign: "center",
  },
});
