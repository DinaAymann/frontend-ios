import React from "react";
import { ActivityIndicator, View } from "react-native";

const Loader = ({ size = "small", color = "#fff", style }) => (
  <View
    style={[{ flex: 1, justifyContent: "center", alignItems: "center" }, style]}
  >
    <ActivityIndicator size={size} color={color} />
  </View>
);

export default Loader;
