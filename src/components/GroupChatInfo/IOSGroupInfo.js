import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../LanguageContext";
import Typography from "../Typography";
import colors from "../../styles/colors";
import CustomAlertModal from "../Modals/CustomAlertModal";
import { Ionicons } from "@expo/vector-icons";

const IOSGroupInfo = ({ selectedChats }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
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
    <View style={styles.container}>
      <CustomAlertModal visible={isModalVisible} onClose={closeAlert} />

      {/* --------------columnContainer-------------- */}
      <View style={styles.columnContainer}>
        <Image
          source={require("../../assets/anonymous.png")}
          style={styles.imageContainer}
        />
        <View style={[styles.textBodyContainer]}>
          <Typography text={"Untitled Group"} size={28} />
          <Typography
            text={`${t("groupInfoScreen.memberGroupTitle")} · ${
              selectedChats.length
            } ${t("groupInfoScreen.membersCount")}`}
            size={14}
          />
        </View>
      </View>

      {/* --------------Row View-------------- */}
      <View style={styles.iconRowContainer}>
        {/* --------------Audio-------------- */}
        <TouchableOpacity style={styles.features} onPress={() => showAlert()}>
          <View style={styles.columnContainer}>
            <Ionicons name="call-outline" size={22} color={colors.white} />
            <Typography
              text={t("groupInfoScreen.rowHeader.audio")}
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
              text={t("groupInfoScreen.rowHeader.video")}
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
              text={t("groupInfoScreen.rowHeader.search")}
              color={colors.white}
              size={11}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* --------------Description-------------- */}
      <TouchableOpacity onPress={() => showAlert()}>
        <View style={styles.descriptionContainer}>
          <Typography
            text={t("groupInfoScreen.welcomeHeader.groupDescription")}
            color={colors.white}
            size={14}
            textAlign={textAlign}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.statusContainer}>
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
                text={t("groupInfoScreen.mediaHeader.mediaLinks")}
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
          <View style={[styles.rowContainer, { flexDirection: rowDirection }]}>
            <View
              style={[
                styles.prefixRowContainer,
                { flexDirection: rowDirection },
              ]}
            >
              <Ionicons
                name="star-outline"
                size={14}
                color={colors.white}
                style={iconPadding}
              />
              <Typography
                text={t("groupInfoScreen.mediaHeader.starredMessages")}
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
      </View>

      {/* --------------Chat-Settings-------------- */}
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
                size={16}
                color={colors.white}
                style={iconPadding}
              />
              <Typography
                text={t("groupInfoScreen.chatSettings.notifications")}
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
          <View style={[styles.rowContainer, { flexDirection: rowDirection }]}>
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
                text={t("groupInfoScreen.chatSettings.wallpaper")}
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
          <View style={[styles.rowContainer, { flexDirection: rowDirection }]}>
            <View
              style={[
                styles.prefixRowContainer,
                { flexDirection: rowDirection },
              ]}
            >
              <MaterialIcons
                name="save-alt"
                size={16}
                color={colors.white}
                style={iconPadding}
              />
              <Typography
                text={t("groupInfoScreen.chatSettings.savePhotos")}
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
      </View>
      {/* --------------Chat-Security-------------- */}
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
                name="timer-outline"
                size={16}
                color={colors.white}
                style={iconPadding}
              />
              <Typography
                text={t("groupInfoScreen.chatSecurity.disappearMessages")}
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
                  text={t("groupInfoScreen.chatSecurity.lockChat")}
                  color={colors.white}
                  size={14}
                  textAlign={textAlign}
                />
                <Typography
                  text={t("groupInfoScreen.chatSecurity.lockChatBody")}
                  color={colors.white}
                  size={10}
                  noLimit={true}
                  textAlign={textAlign}
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
                name="lock-closed-outline"
                size={14}
                color={colors.white}
                style={iconPadding}
              />
              <View style={[styles.contentColumn, aligntext]}>
                <Typography
                  text={t("groupInfoScreen.chatSecurity.encryption")}
                  color={colors.white}
                  size={14}
                  textAlign={textAlign}
                />
                <Typography
                  text={t("groupInfoScreen.chatSecurity.encryptionBody")}
                  color={colors.white}
                  size={10}
                  noLimit={true}
                  textAlign={textAlign}
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
      </View>

      {/* --------------listRowHeaderContainer-------------- */}

      <View
        style={[styles.listRowHeaderContainer, { flexDirection: rowDirection }]}
      >
        <Typography
          text={`${selectedChats.length} Members`}
          size={14}
          color={colors.black}
          textAlign={textAlign}
        />
        <TouchableOpacity onPress={() => showAlert()}>
          <Ionicons size={18} name="search" color={colors.black} />
        </TouchableOpacity>
      </View>

      {/* --------------listContainer-------------- */}

      <View style={styles.listContainer}>
        <View style={styles.membersColumnContainer}>
          {selectedChats.map((chat) => (
            <View
              key={chat.id}
              style={[styles.selectedItem, { flexDirection: rowDirection }]}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ContactInfoScreen", {
                    userProfilePhoto: chat?.profilePhotoUrl,
                    userName: chat?.user,
                  })
                }
              >
                <View
                  style={[
                    styles.memberSelectItem,
                    { flexDirection: rowDirection },
                  ]}
                >
                  <Image
                    source={{ uri: chat.profilePhotoUrl }}
                    style={[styles.profileImage, { marginHorizontal: 5 }]}
                  />
                  <Typography
                    text={chat.user}
                    color={colors.white}
                    size={14}
                    textAlign={textAlign}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ContactInfoScreen", {
                    userProfilePhoto: chat?.userProfilePhoto,
                  })
                }
              >
                <Ionicons
                  name="chevron-forward-sharp"
                  size={15}
                  color={colors.white}
                  style={(styles.icon, iconRotation)}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* --------------group-features-------------- */}
      <View style={[styles.groupFeaturesContainer]}>
        <TouchableOpacity style={styles.separator} onPress={() => showAlert()}>
          <Typography
            text={"Add to Favorites"}
            size={15}
            color={colors.white}
            textAlign={textAlign}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.separator} onPress={() => showAlert()}>
          <Typography
            text={"Export Chat"}
            size={14}
            color={colors.white}
            textAlign={textAlign}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.separator} onPress={() => showAlert()}>
          <Typography
            text={"Clear Chat"}
            size={14}
            color={colors.white}
            textAlign={textAlign}
          />
        </TouchableOpacity>
      </View>

      {/* --------------Exit/Report-Group-------------- */}
      <View style={styles.exitReportGroup}>
        <TouchableOpacity style={styles.separator} onPress={() => showAlert()}>
          <Typography
            text={"Exit group"}
            size={15}
            color={colors.white}
            textAlign={textAlign}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showAlert()}>
          <Typography
            text={"Report group"}
            size={14}
            color={colors.white}
            textAlign={textAlign}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IOSGroupInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.white,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 40,
  },
  columnContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  membersColumnContainer: {
    flexDirection: "column",
  },
  statusContainer: {
    margin: 8,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: colors.purple,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  rowContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  prefixRowContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  listRowHeaderContainer: {
    marginTop: 15,
    marginBottom: 5,
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 20,
    justifyContent: "space-between",
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
  textBodyContainer: {
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionContainer: {
    margin: 8,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: colors.purple,
  },
  listContainer: {
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    backgroundColor: colors.purple,
  },
  selectedItem: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.white,
  },
  memberSelectItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  groupFeaturesContainer: {
    margin: 10,
    padding: 10,
    flexDirection: "column",
    borderRadius: 10,
    backgroundColor: colors.purple,
  },
  separator: {
    borderBottomWidth: 0.2,
    paddingVertical: 5,
    borderBottomColor: colors.grey,
  },
  exitReportGroup: {
    margin: 10,
    borderRadius: 10,
    padding: 10,
    flexDirection: "column",
    backgroundColor: colors.purple,
  },
  iconRowContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 10,
  },
});
