import React, { useContext } from "react";
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
  TextInput,
} from "react-native";
import { useChat } from "../ChatContext";
import colors from "../../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import CreateGroupHeader from "../Headers/CreateGroupHeader";
import Typography from "../Typography";
import Separator from "../Separator";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../LanguageContext";

const CreateGroupModal = ({ value, onChangeText, isVisible, closeModal }) => {
  const { selectedChatIds, chats } = useChat();
  const navigation = useNavigation();
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
  const selectedChats = chats.filter((chat) =>
    selectedChatIds.includes(chat.id)
  );

  return (
    <Modal
      visible={isVisible}
      onRequestClose={closeModal}
      presentationStyle="pageSheet"
      animationType="slide"
    >
      <CreateGroupHeader
        closeModal={closeModal}
        value={value}
        onChangeText={onChangeText}
      />
      <View style={[styles.container, { flexDirection: rowDirection }]}>
        <Ionicons
          name="camera"
          size={20}
          color={colors.grey2}
          style={{
            padding: 10,
          }}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={t("thirdModal.groupName")}
          placeholderTextColor={colors.grey}
          style={[styles.textInputContainer, { textAlign }]}
        />
      </View>
      <View style={styles.textColumn}>
        <View style={[styles.textRow, { flexDirection: rowDirection }]}>
          <Typography
            text={t("thirdModal.disappearingMessages")}
            borderRadius={5}
            paddingHorizontal={20}
            paddingVertical={10}
          />
          <View style={[styles.iconContainer, { flexDirection: rowDirection }]}>
            <Typography text={"Off"} />
            <Ionicons
              name="chevron-forward-sharp"
              size={20}
              style={(iconPadding, iconRotation)}
              color={colors.grey2}
            />
          </View>
        </View>
        <Separator marginHorizontal={40} />
        <View style={[styles.textRow, { flexDirection: rowDirection }]}>
          <Typography
            text={t("thirdModal.groupPermissions")}
            borderRadius={5}
            paddingHorizontal={20}
            paddingVertical={10}
          />
          <Ionicons
            name="chevron-forward-sharp"
            size={20}
            color={colors.grey2}
            style={iconRotation}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {selectedChats.map((chat) => (
          <View key={chat.id} style={styles.selectedItem}>
            <Image
              source={{ uri: chat.profilePhotoUrl }}
              style={styles.selectedProfileImage}
            />
          </View>
        ))}
      </ScrollView>
    </Modal>
  );
};

export default CreateGroupModal;

const styles = StyleSheet.create({
  textColumn: {
    flexDirection: "column",
    paddingVertical: 15,
    alignItems: "flex-start",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 15,
    alignItems: "flex-start",
    width: "100%",
    marginLeft: 10,
  },
  textInputContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
  },
  container: {
    flexDirection: "row",
    borderColor: colors.grey,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 20,
  },
  selectedProfileImage: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginRight: 5,
    marginTop: 10,
    marginLeft: 10,
  },
});
