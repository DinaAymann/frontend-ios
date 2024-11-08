import React, { useState, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Image,
  StyleSheet,
} from "react-native";
import colors from "../../styles/colors";
import Typography from "../Typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import CustomAlertModal from "../Modals/CustomAlertModal";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../LanguageContext";
const AndroidMessageInfo = ({ userProfilePhoto, userName }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);

  const showAlert = () => {
    setModalVisible(true);
  };

  const closeAlert = () => {
    setModalVisible(false);
  };

  const RTL_LANGUAGES = ["ar-EG", "ar-AM", "fa-IR"];
  const textAlign = RTL_LANGUAGES.includes(language) ? "right" : "left";
  const rowDirection = RTL_LANGUAGES.includes(language) ? "row-reverse" : "row";
  const iconPadding = RTL_LANGUAGES.includes(language)
    ? { paddingLeft: 10 }
    : { paddingRight: 10 };
  const iconRotation = RTL_LANGUAGES.includes(language)
    ? { transform: [{ rotate: "180deg" }] }
    : { transform: [{ rotate: "0deg" }] };
  const aligntext = RTL_LANGUAGES.includes(language)
    ? { alignItems: "flex-end" }
    : { alignItems: "flex-start" };

  return (
    <Animated.ScrollView style={styles.container}>
      <CustomAlertModal visible={isModalVisible} onClose={closeAlert} />
      <View style={styles.columnContainer}>
        <Image
          style={styles.imageContainer}
          source={{ uri: userProfilePhoto }}
        />
        <Typography
          text={userName}
          color={colors.black}
          size={28}
          paddingTop={10}
        />
        <Typography text={"+20 123 456 7891"} color={colors.black} size={14} />
      </View>

      <View style={styles.iconRowContainer}>
        {/* --------------Audio-------------- */}
        <TouchableOpacity style={styles.features} onPress={() => showAlert()}>
          <View style={styles.columnContainer}>
            <Ionicons name="call-outline" size={22} color={colors.white} />
            <Typography
              text={t("contactInfoScreen.rowHeader.audio")}
              color={colors.white}
              size={11}
            />
          </View>
        </TouchableOpacity>
        {/* --------------Video-------------- */}
        <TouchableOpacity style={styles.features} onPress={() => showAlert()}>
          <View style={styles.columnContainer}>
            <Ionicons name="videocam-outline" size={22} color={colors.white} />
            <Typography
              text={t("contactInfoScreen.rowHeader.video")}
              color={colors.white}
              size={11}
            />
          </View>
        </TouchableOpacity>
        {/* --------------Search-------------- */}
        <TouchableOpacity style={styles.features} onPress={() => showAlert()}>
          <View style={styles.columnContainer}>
            <Ionicons name="search" size={22} color={colors.white} />
            <Typography
              text={t("contactInfoScreen.rowHeader.search")}
              color={colors.white}
              size={11}
            />
          </View>
        </TouchableOpacity>
      </View>
      {/* --------------Bio-------------- */}
      <TouchableOpacity onPress={() => showAlert()}>
        <View style={styles.statusContainer}>
          <Typography
            text={t("contactInfoScreen.welcomeHeader.title")}
            color={colors.white}
            size={14}
            textAlign="flex-start"
          />
          <Typography
            text={t("contactInfoScreen.welcomeHeader.date")}
            color={colors.white}
            size={10}
            textAlign="flex-start"
          />
        </View>
      </TouchableOpacity>

      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={() => showAlert()}>
          <View style={[styles.rowContainer, { flexDirection: rowDirection }]}>
            <Typography
              text={t("contactInfoScreen.mediaHeader.mediaLinks")}
              color={colors.white}
              size={14}
            />
            <Ionicons
              name="chevron-forward-sharp"
              size={14}
              color={colors.white}
              style={iconRotation}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={() => showAlert()}>
          <View style={[styles.rowContainer, { flexDirection: rowDirection }]}>
            <View
              style={[
                styles.prefixRowContainer,
                { flexDirection: rowDirection },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={14}
                color={colors.white}
                style={iconPadding}
              />
              <Typography
                text={t("contactInfoScreen.chatSettings.notifications")}
                color={colors.white}
                size={14}
              />
            </View>
            <Ionicons
              name="chevron-forward-sharp"
              size={14}
              color={colors.white}
              style={iconRotation}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity onPress={() => showAlert()}>
          <View style={[styles.rowContainer, { flexDirection: rowDirection }]}>
            <View
              style={[
                styles.prefixRowContainer,
                { flexDirection: rowDirection },
              ]}
            >
              <FontAwesome
                name="photo"
                size={14}
                color={colors.white}
                style={iconPadding}
              />
              <Typography
                text={t("contactInfoScreen.mediaHeader.mediaVisibility")}
                color={colors.white}
                size={14}
              />
            </View>
            <Ionicons
              name="chevron-forward-sharp"
              size={14}
              color={colors.white}
              style={iconRotation}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={() => showAlert()}>
          <View style={[styles.rowContainer, { flexDirection: rowDirection }]}>
            <View
              style={[
                styles.prefixRowContainer,
                { flexDirection: rowDirection },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={14}
                color={colors.white}
                style={iconPadding}
              />
              <View style={[styles.contentColumn, aligntext]}>
                <Typography
                  text={t("contactInfoScreen.chatSecurity.encryption")}
                  color={colors.white}
                  size={14}
                />
                <Typography
                  text={t("contactInfoScreen.chatSecurity.encryptionBody")}
                  color={colors.white}
                  size={10}
                  noLimit={true}
                />
              </View>
            </View>
            <Ionicons
              name="chevron-forward-sharp"
              size={14}
              color={colors.white}
              style={iconRotation}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity onPress={() => showAlert()}>
          <View style={[styles.rowContainer, { flexDirection: rowDirection }]}>
            <View
              style={[
                styles.prefixRowContainer,
                { flexDirection: rowDirection },
              ]}
            >
              <Ionicons
                name="timer-outline"
                size={14}
                color={colors.white}
                style={iconPadding}
              />
              <Typography
                text={t("contactInfoScreen.chatSecurity.disappearMessages")}
                color={colors.white}
                size={14}
              />
            </View>
            <Ionicons
              name="chevron-forward-sharp"
              size={14}
              color={colors.white}
              style={iconRotation}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity onPress={() => showAlert()}>
          <View style={[styles.rowContainer, { flexDirection: rowDirection }]}>
            <View
              style={[
                styles.prefixRowContainer,
                { flexDirection: rowDirection },
              ]}
            >
              <MaterialCommunityIcons
                name="message-lock-outline"
                size={14}
                color={colors.white}
                style={iconPadding}
              />
              <View style={[styles.contentColumn, aligntext]}>
                <Typography
                  text={t("contactInfoScreen.chatSecurity.lockChat")}
                  color={colors.white}
                  size={14}
                />
                <Typography
                  text={t("contactInfoScreen.chatSecurity.lockChatBody")}
                  color={colors.white}
                  size={10}
                  noLimit={true}
                />
              </View>
            </View>
            <FontAwesome
              name="toggle-off"
              size={18}
              color={colors.white}
              style={iconRotation}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.listRowHeaderContainer, { flexDirection: rowDirection }]}
      >
        <Typography
          text={t("contactInfoScreen.createGroupWith.commonGroup")}
          size={14}
          color={colors.black}
        />
      </View>

      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={() => showAlert()}>
          <View
            style={[styles.prefixRowContainer, { flexDirection: rowDirection }]}
          >
            <View
              style={[
                styles.createIconGrpContainer,
                { flexDirection: rowDirection, marginHorizontal: 5 },
              ]}
            >
              <Feather name="users" size={14} color={colors.white} />
            </View>
            <Typography
              text={`${t(
                "contactInfoScreen.createGroupWith.createGroupWith"
              )}  ${userName}`}
              color={colors.white}
              size={14}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.groupFeaturesContainer]}>
        <TouchableOpacity onPress={() => showAlert()}>
          <View
            style={[styles.prefixRowContainer, { flexDirection: rowDirection }]}
          >
            <MaterialCommunityIcons
              name="cards-heart-outline"
              size={14}
              color={colors.white}
              style={iconPadding}
            />
            <Typography
              text={t("contactInfoScreen.shareContactAndFav.addFav")}
              size={15}
              color={colors.white}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={() => showAlert()}>
          <View
            style={[styles.prefixRowContainer, { flexDirection: rowDirection }]}
          >
            <MaterialCommunityIcons
              name="block-helper"
              size={14}
              color={colors.white}
              style={iconPadding}
            />
            <Typography
              text={`${t(
                "contactInfoScreen.blockReportContainer.block"
              )}  ${userName}`}
              size={15}
              color={colors.white}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={() => showAlert()}>
          <View
            style={[styles.prefixRowContainer, { flexDirection: rowDirection }]}
          >
            <MaterialCommunityIcons
              name="thumb-down"
              size={14}
              color={colors.white}
              style={iconPadding}
            />
            <Typography
              text={`${t(
                "contactInfoScreen.blockReportContainer.report"
              )}  ${userName}`}
              size={14}
              color={colors.white}
            />
          </View>
        </TouchableOpacity>
      </View>
    </Animated.ScrollView>
  );
};

export default AndroidMessageInfo;

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.white,
    paddingBottom: 30,
  },
  columnContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  contentColumn: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
  iconRowContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 10,
  },
  rowContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  prefixRowContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  features: {
    width: "30%",
    height: "90%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.purple,
  },
  statusContainer: {
    margin: 8,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: "column",
    backgroundColor: colors.purple,
    justifyContent: "space-between",
  },
  listRowHeaderContainer: {
    marginTop: 15,
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 20,
    justifyContent: "space-between",
  },
  groupFeaturesContainer: {
    margin: 10,
    padding: 20,
    flexDirection: "column",
    borderRadius: 10,
    backgroundColor: colors.purple,
  },
  separator: {
    borderBottomWidth: 1,
    marginVertical: 5,
    borderBottomColor: colors.grey3,
  },
  exitReportGroup: {
    margin: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "column",
    backgroundColor: colors.purple,
  },
  createIconGrpContainer: {
    padding: 5,
    marginRight: 5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green,
  },
});
