import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  Modal,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import MaterialCommIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import colors from "../../styles/colors";
import ReusableHeader from "../Headers/ReusableHeader";
import { useChat } from "../ChatContext";
import ReusableTextInput from "../ReusableTextInput";
import Typography from "../Typography";
import AlphabetList from "../AlphabetList";
import AddMembersModal from "./AddMembersModal";
import CreateGroupModal from "./CreateGroupModal";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../LanguageContext";

export const groupChatsByInitial = (chats) => {
  const grouped = {};
  chats.forEach((chat) => {
    const firstLetter = chat.user[0].toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(chat);
  });

  const sortedGroups = Object.keys(grouped)
    .sort()
    .map((letter) => ({ title: letter, data: grouped[letter] }));
  return sortedGroups;
};

const GroupChatModal = ({ isVisible, closeModal }) => {
  const { chats } = useChat();
  const navigation = useNavigation();
  const groupedChats = groupChatsByInitial(chats);
  const sectionListRef = useRef(null);
  const [isNewGroupVisible, setNewGroupVisible] = useState(false);
  const [isCreateGroupVisible, setCreateGroupVisible] = useState(false);
  const [isGroupChatVisible, setGroupChatVisible] = useState(false);
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);
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

  const handleClose = () => {
    setGroupChatVisible(false);
    closeModal();
  };

  const handleOpenAddMembersModal = () => {
    setNewGroupVisible(true);
    closeModal();
  };

  const handleCloseAddMembersModal = () => {
    setNewGroupVisible(false);
    closeModal();
  };

  const handleCloseCreateGroupModal = () => {
    setCreateGroupVisible(false);
    closeModal();
  };

  const handleCloseAllCreateGroupModal = () => {
    setNewGroupVisible(false);
    setCreateGroupVisible(false);
    setGroupChatVisible(false);
    closeModal();
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => [
        navigation.navigate("ChatInputArea", {
          chatId: item.id,
          userName: item.user,
          userMessages: item.messages,
          userProfilePhoto: item.profilePhotoUrl,
        }),
        closeModal(),
      ]}
    >
      <View style={[styles.item, { flexDirection: rowDirection }]}>
        <Image
          source={{ uri: item.profilePhotoUrl }}
          style={styles.profileImage}
        />
        <View style={styles.userNameContainer}>
          <Typography text={item.user} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.modalOverlay}>
      <Modal
        visible={
          (isGroupChatVisible || isVisible) &&
          !isNewGroupVisible &&
          !isCreateGroupVisible
        }
        onRequestClose={closeModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ReusableHeader
          title={t("firstModal.title")}
          showAddIcon={false}
          showCameraIcon={false}
          showCloseIcon={true}
          centerTitle={true}
          onClosePress={handleClose}
        />
        <ReusableTextInput />

        <View style={[styles.columnContainer]}>
          <TouchableOpacity onPress={handleOpenAddMembersModal}>
            <View
              style={[styles.rowContainer, { flexDirection: rowDirection }]}
            >
              <MaterialIcon
                name="people-alt"
                size={24}
                color={colors.black}
                style={iconPadding}
              />
              <Typography
                text={t("firstModal.newGroup")}
                color={colors.grey2}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* <AlphabetList onLetterSelect={handleLetterSelect} /> */}

        <SectionList
          ref={sectionListRef}
          sections={groupedChats}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id.toString()}
          stickySectionHeadersEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      </Modal>

      <AddMembersModal
        isVisible={isNewGroupVisible}
        closeModal={handleCloseAddMembersModal}
        reopenOldModal={() => setGroupChatVisible(false)}
        setCreateGroupVisible={setCreateGroupVisible}
      />

      <CreateGroupModal
        isVisible={isCreateGroupVisible}
        closeModal={handleCloseCreateGroupModal}
        reopenOldModal={() => setNewGroupVisible(false)}
        onCloseGroup={handleCloseAllCreateGroupModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
  userNameContainer: {
    paddingHorizontal: 10,
  },
  item: {
    padding: 15,
    alignItems: "center",
    borderBottomColor: colors.grey,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.grey2,
  },
  columnContainer: {
    flexDirection: "column",
    marginHorizontal: 30,
    borderRadius: 10,
    borderWidth: 0.2,
    backgroundColor: colors.white,
  },
  rowContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  separator: {
    width: "100%",
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
  },
});

export default GroupChatModal;
