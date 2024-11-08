import React from "react";
import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";
import colors from "../../styles/colors";
import Typography from "../Typography";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
const SingleChatHeader = ({
  navigation,
  title,
  userProfilePhoto,
  onTitlePress,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconButton}
      >
      <MaterialIcons name="arrow-back-ios" size={25} color={colors.white} />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Image source={{ uri: userProfilePhoto }} style={styles.profilePhoto} />
        <TouchableOpacity onPress={onTitlePress}>
          <Typography
            text={title}
            color={colors.white}
            size={18}
            fontFamily="Cairo-Regular"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <AntDesign name="videocamera" size={28} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="call-outline" size={28} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000",
    paddingHorizontal: 10,
    height: 70,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  iconButton: {
    padding: 20,
    marginLeft: -20,
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
  },
});

export default SingleChatHeader;
