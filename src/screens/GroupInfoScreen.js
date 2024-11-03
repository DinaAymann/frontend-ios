import React from "react";
import { StyleSheet, ScrollView, Platform } from "react-native";
import colors from "../styles/colors";
import IOSGroupInfo from "../components/GroupChatInfo/IOSGroupInfo";
import AndroidGroupInfo from "../components/GroupChatInfo/AndroidGroupInfo";

const GroupInfoScreen = ({ route }) => {
  const { selectedChats } = route.params;

  return (
    <ScrollView style={styles.container}>
      {Platform.OS === "ios" ? (
        <IOSGroupInfo selectedChats={selectedChats} />
      ) : (
        <AndroidGroupInfo selectedChats={selectedChats} />
      )}
    </ScrollView>
  );
};

export default GroupInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.white,
  },
});
