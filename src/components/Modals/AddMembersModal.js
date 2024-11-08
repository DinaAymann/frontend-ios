import React, { useRef, useContext } from "react";
import {
  View,
  Text,
  Modal,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  PanResponder,
} from "react-native";
import { useChat } from "../ChatContext";
import ConfirmHeader from "../Headers/ConfirmHeader";
import ReusableTextInput from "../ReusableTextInput";
import colors from "../../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import Typography from "../Typography";
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

const SelectedTag = ({ selectedChatIds, chats, onRemoveChat }) => {
  const { language } = useContext(LanguageContext);
  const RTL_LANGUAGES = ["ar-EG", "ar-AM", "fa-IR"];
  const rowDirection = RTL_LANGUAGES.includes(language) ? "row-reverse" : "row";

  const selectedChats = chats.filter((chat) =>
    selectedChatIds.includes(chat.id)
  );

  if (selectedChats.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.selectedTag, { flexDirection: rowDirection }]}
    >
      {selectedChats.map((chat) => (
        <View key={chat.id} style={styles.selectedItem}>
          <Image
            source={{ uri: chat.profilePhotoUrl }}
            style={styles.selectedProfileImage}
          />
          <TouchableOpacity
            style={[styles.closeIconContainer, { flexDirection: rowDirection }]}
            onPress={() => onRemoveChat(chat.id)}
          >
            <Ionicons name="close-circle" size={24} color={colors.grey3} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const AddMembersModal = ({
  isVisible,
  closeModal,
  reopenOldModal,
  setCreateGroupVisible,
}) => {
  const { chats, selectedChatIds, toggleChatSelection } = useChat();
  const groupedChats = groupChatsByInitial(chats);
  const sectionListRef = useRef(null);
  const selectedChatCount = selectedChatIds.length;
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

  const onRemoveChat = (id) => {
    toggleChatSelection(id);
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={[styles.sectionHeader, aligntext]}>
      <Typography text={title} color={colors.grey2} />
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleChatSelection(item.id)}>
      <View style={[styles.item, { flexDirection: rowDirection }]}>
        <Image
          source={{ uri: item.profilePhotoUrl }}
          style={styles.profileImage}
        />
        <View style={[styles.itemTextContainer, { paddingHorizontal: 10 }]}>
          <Typography text={item.user} textAlign={textAlign} />
        </View>
        <View style={styles.radioButton}>
          {selectedChatIds.includes(item.id) && (
            <View style={styles.radioButtonSelected} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      onRequestClose={closeModal}
      presentationStyle="pageSheet"
      animationType="slide"
    >
      <ConfirmHeader
        closeModal={closeModal}
        reopenOldModal={() => {
          closeModal();
          reopenOldModal();
        }}
        selectedChatCount={selectedChatCount}
        setCreateGroupVisible={setCreateGroupVisible}
      />
      <ReusableTextInput />

      <SelectedTag
        selectedChatIds={selectedChatIds}
        chats={chats}
        onRemoveChat={onRemoveChat}
      />

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
  );
};

const styles = StyleSheet.create({
  selectedTag: {
    flexDirection: "row",
    backgroundColor: colors.lightGrey,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
    marginLeft: 10,
  },
  selectedProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 80,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  item: {
    padding: 15,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.purple,
  },
  closeIconContainer: {
    position: "absolute",
    top: -25,
    right: -6,
  },
  itemTextContainer: {
    flex: 1,
  },
});

export default AddMembersModal;
