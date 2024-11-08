import React, { useState, useContext } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../../styles/colors";
import CustomAlertModal from "../Modals/CustomAlertModal";
import { LanguageContext } from "../LanguageContext";
import { useTranslation } from "react-i18next";
import Typography from "../Typography";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const IOSMessageInfo = ({ userProfilePhoto, userName }) => {
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
    <>
      <View style={styles.container}>
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
          <Typography
            text={"+20 123 456 7891"}
            color={colors.black}
            size={14}
          />
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
              <Ionicons
                name="videocam-outline"
                size={22}
                color={colors.white}
              />
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

        <TouchableOpacity onPress={() => showAlert()}>
          <View style={styles.statusContainer}>
            <Typography
              text={t("contactInfoScreen.welcomeHeader.title")}
              color={colors.white}
              size={14}
              textAlign={textAlign}
            />
            <Typography
              text={t("contactInfoScreen.welcomeHeader.date")}
              color={colors.white}
              size={10}
              textAlign={textAlign}
            />
          </View>
        </TouchableOpacity>

        {/* --------------Media-Container-------------- */}
        <View style={styles.statusContainer}>
          <TouchableOpacity onPress={() => showAlert()}>
            <View
              style={[styles.rowContainer, { flexDirection: rowDirection }]}
            >
              <View
                style={[
                  styles.prefixRowContainer,
                  { flexDirection: rowDirection },
                ]}
              >
                <FontAwesome
                  name="photo"
                  size={16}
                  color={colors.white}
                  style={iconPadding}
                />
                <Typography
                  text={t("contactInfoScreen.mediaHeader.mediaLinks")}
                  color={colors.white}
                  size={14}
                  textAlign={textAlign}
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
            <View
              style={[styles.rowContainer, { flexDirection: rowDirection }]}
            >
              <View
                style={[
                  styles.prefixRowContainer,
                  { flexDirection: rowDirection },
                ]}
              >
                <Ionicons
                  name="star-outline"
                  size={16}
                  color={colors.white}
                  style={iconPadding}
                />
                <Typography
                  text={t("contactInfoScreen.mediaHeader.starredMessages")}
                  color={colors.white}
                  size={14}
                  paddingLeft={7}
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

        {/* --------------Chat-Settings-------------- */}
        <View style={styles.statusContainer}>
          <TouchableOpacity onPress={() => showAlert()}>
            <View
              style={[styles.rowContainer, { flexDirection: rowDirection }]}
            >
              <View
                style={[
                  styles.prefixRowContainer,
                  { flexDirection: rowDirection },
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={16}
                  color={colors.white}
                  style={iconPadding}
                />
                <Typography
                  text={t("contactInfoScreen.chatSettings.notifications")}
                  color={colors.white}
                  size={14}
                  paddingLeft={7}
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
            <View
              style={[styles.rowContainer, { flexDirection: rowDirection }]}
            >
              <View
                style={[
                  styles.prefixRowContainer,
                  { flexDirection: rowDirection },
                ]}
              >
                <Ionicons
                  name="flower-outline"
                  size={16}
                  color={colors.white}
                  style={iconPadding}
                />
                <Typography
                  text={t("contactInfoScreen.chatSettings.wallpaper")}
                  color={colors.white}
                  size={14}
                  paddingLeft={7}
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
            <View
              style={[styles.rowContainer, { flexDirection: rowDirection }]}
            >
              <View
                style={[
                  styles.prefixRowContainer,
                  { flexDirection: rowDirection },
                ]}
              >
                <MaterialIcons
                  name="save-alt"
                  size={14}
                  color={colors.white}
                  style={iconPadding}
                />
                <Typography
                  text={t("contactInfoScreen.chatSettings.savePhotos")}
                  color={colors.white}
                  size={14}
                  paddingLeft={7}
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
        {/* --------------Chat-Security-------------- */}
        <View style={styles.statusContainer}>
          <TouchableOpacity onPress={() => showAlert()}>
            <View
              style={[styles.rowContainer, { flexDirection: rowDirection }]}
            >
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
                  paddingLeft={7}
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
            <View
              style={[styles.rowContainer, { flexDirection: rowDirection }]}
            >
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
                    paddingLeft={7}
                  />
                  <Typography
                    text={t("contactInfoScreen.chatSecurity.lockChatBody")}
                    color={colors.white}
                    size={10}
                    noLimit={true}
                    paddingLeft={7}
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
            <View
              style={[styles.rowContainer, { flexDirection: rowDirection }]}
            >
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
                    paddingLeft={7}
                  />
                  <Typography
                    text={t("contactInfoScreen.chatSecurity.encryptionBody")}
                    color={colors.white}
                    size={10}
                    noLimit={true}
                    paddingLeft={7}
                  />
                </View>
              </View>
              <Ionicons
                name="chevron-forward-sharp"
                size={14}
                paddingLeft={5}
                color={colors.white}
                style={iconRotation}
              />
            </View>
          </TouchableOpacity>
        </View>
        {/* --------------Contact-Details-------------- */}
        <View style={styles.statusContainer}>
          <TouchableOpacity onPress={() => showAlert()}>
            <View
              style={[styles.rowContainer, { flexDirection: rowDirection }]}
            >
              <View
                style={[
                  styles.prefixRowContainer,
                  { flexDirection: rowDirection },
                ]}
              >
                <MaterialCommunityIcons
                  name="account-circle-outline"
                  size={14}
                  color={colors.white}
                  style={iconPadding}
                />
                <Typography
                  text={t("contactInfoScreen.contactDetails.title")}
                  color={colors.white}
                  size={14}
                  paddingLeft={7}
                />
              </View>
              <Ionicons
                name="chevron-forward-sharp"
                size={14}
                paddingLeft={5}
                color={colors.white}
                style={iconRotation}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* --------------Common-Groups-------------- */}
        <View
          style={[
            styles.listRowHeaderContainer,
            { flexDirection: rowDirection },
          ]}
        >
          <Typography
            text={t("contactInfoScreen.createGroupWith.commonGroup")}
            size={14}
            color={colors.black}
          />
        </View>
        <TouchableOpacity onPress={() => showAlert()}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.prefixRowContainer,
                { flexDirection: rowDirection },
              ]}
            >
              <View
                style={[
                  styles.createIconGrpContainer,
                  { flexDirection: rowDirection, marginHorizontal: 5 },
                ]}
              >
                <Ionicons name="add" size={14} color={colors.white} />
              </View>
              <Typography
                text={`${t(
                  "contactInfoScreen.createGroupWith.createGroupWith"
                )}  ${userName}`}
                color={colors.white}
                size={14}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* --------------group-features-------------- */}
        <View style={styles.groupFeaturesContainer}>
          <TouchableOpacity onPress={() => showAlert()}>
            <Typography
              text={t("contactInfoScreen.shareContactAndFav.shareContact")}
              size={15}
              color={colors.white}
              textAlign={textAlign}
            />
          </TouchableOpacity>
          <View style={styles.separator} />

          <TouchableOpacity onPress={() => showAlert()}>
            <Typography
              text={t("contactInfoScreen.shareContactAndFav.addFav")}
              size={15}
              color={colors.white}
              textAlign={textAlign}
            />
          </TouchableOpacity>
          <View style={styles.separator} />

          <TouchableOpacity onPress={() => showAlert()}>
            <Typography
              text={t("contactInfoScreen.shareContactAndFav.exportChat")}
              size={14}
              color={colors.white}
              textAlign={textAlign}
            />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity onPress={() => showAlert()}>
            <Typography
              text={t("contactInfoScreen.shareContactAndFav.clearChat")}
              size={14}
              color={colors.white}
              textAlign={textAlign}
            />
          </TouchableOpacity>
        </View>

        {/* --------------Exit/Report-Group-------------- */}
        <View style={styles.exitReportGroup}>
          <TouchableOpacity onPress={() => showAlert()}>
            <Typography
              text={`${t(
                "contactInfoScreen.blockReportContainer.block"
              )}  ${userName}`}
              size={15}
              color={colors.white}
              textAlign={textAlign}
            />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity onPress={() => showAlert()}>
            <Typography
              text={`${t(
                "contactInfoScreen.blockReportContainer.report"
              )}  ${userName}`}
              size={14}
              color={colors.white}
              textAlign={textAlign}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default IOSMessageInfo;

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
