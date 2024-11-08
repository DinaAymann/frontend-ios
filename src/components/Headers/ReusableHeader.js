import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Typography from "../Typography";
import { useTranslation } from "react-i18next";

const ReusableHeader = ({
  onAddPress,
  onClosePress,
  showCameraIcon = true,
  showAddIcon = true,
  centerTitle = false,
  showCloseIcon = true,
}) => {
  const noIcons = !showCameraIcon && !showAddIcon && !showCloseIcon;
  const navigation = useNavigation();
  const { t } = useTranslation();
  return (
    <View
      style={[
        styles.headerContainer,
        (centerTitle || noIcons) && styles.centerTitleContainer,
      ]}
    >
      <Typography text={t("firstModal.title")} size={30} color={colors.black} />
      {!noIcons && (
        <View style={styles.iconsContainer}>
          {showCameraIcon && (
            <TouchableOpacity onPress={() => console.log("Camera is Pressed")}>
              <Ionicons
                name="camera"
                size={24}
                color={colors.black}
                style={{ paddingRight: 20 }}
              />
            </TouchableOpacity>
          )}

          {showAddIcon && (
            <TouchableOpacity onPress={onAddPress}>
              <View style={styles.iconWrapper}>
                <Ionicons name="add" size={24} color={colors.white} />
              </View>
            </TouchableOpacity>
          )}

          {showCloseIcon && (
            <TouchableOpacity onPress={onClosePress}>
              <Ionicons name="close" size={24} color={colors.black} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  centerTitleContainer: {
    paddingLeft: 30,
    justifyContent: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  centeredTitle: {
    textAlign: "center",
    flex: 1,
  },
  iconWrapper: {
    backgroundColor: colors.green,
    borderRadius: 30,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReusableHeader;
