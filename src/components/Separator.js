import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../styles/colors";

const Separator = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: colors.grey,
    marginVertical: 10,
    width: "100%",
  },
});

export default Separator;
