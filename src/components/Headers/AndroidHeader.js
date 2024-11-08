import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Typography from "../Typography";
import colors from "../../styles/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const AndroidHeader = ({ onDotsPress, title }) => {
  return (
    <View style={styles.rowContainer}>
      <Typography text={title} size={25} color={colors.black} />
      <View style={styles.iconRowContainer}>
        <TouchableOpacity onPress={() => console.log("Camera pressed")}>
          <Ionicons name="camera" size={20} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Search pressed")}>
          <Ionicons
            name="search"
            size={20}
            color={colors.black}
            paddingHorizontal={20}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDotsPress}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={20}
            color={colors.black}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AndroidHeader;

const styles = StyleSheet.create({
  rowContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  iconRowContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
