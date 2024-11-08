import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import CustomAlertModal from "./CustomAlertModal";
import colors from "../../styles/colors";
import Typography from "../Typography";

const AndroidWhatsappModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const showAlert = () => {
    setModalVisible(true);
  };

  const closeAlert = () => {
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <CustomAlertModal visible={isModalVisible} onClose={closeAlert} />
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => showAlert()}>
          <Typography text={"New Group"} size={15} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showAlert()}>
          <Typography text={"New broadcast"} size={15} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showAlert()}>
          <Typography text={"Linked Devices"} size={15} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showAlert()}>
          <Typography
            text={"Starred messages"}
            size={15}
            color={colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showAlert()}>
          <Typography text={"Settings"} size={16} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showAlert()}>
          <Typography text={"Switch accounts"} size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AndroidWhatsappModal;

const styles = StyleSheet.create({
  container: {
    width: "40%",
    height: "30%",
    zIndex: 1,
    position: "absolute",
    right: 10,
    top: 40,
    borderRadius: 10,
    backgroundColor: colors.purple,
  },
  textContainer: {
    flex: 1,
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "space-evenly",
  },
});
