import React, { useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from "react-native";

const GeneralSettingsScreen = () => {
  const [isNicknameEnabled, setIsNicknameEnabled] = useState(true);
  const [fullname, setFullname] = useState("");
  const [nickname, setNickname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");

  const toggleSwitch = () =>
    setIsNicknameEnabled((previousState) => !previousState);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => console.log("Open modal to change picture")}
          >
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: "https://example.com/your-image-url.jpg" }}
                style={styles.profileImage}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>Ozzy Osbourne</Text>
          <TouchableOpacity onPress={() => console.log("Change Picture")}>
            <Text style={styles.changePicture}>Change Picture</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullname}
              onChangeText={setFullname}
              placeholder="Full Name"
              placeholderTextColor="#aaa"
              maxLength={20}
            />

            <Text style={styles.label}>Nickname</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="Nickname"
              placeholderTextColor="#aaa"
              maxLength={15}
            />

            <View style={styles.toggleContainer}>
              <Switch
                style={styles.switch}
                trackColor={{ false: "#767577", true: "#9101F0" }}
                thumbColor={isNicknameEnabled ? "#9101F0" : "#f4f3f4"}
                onValueChange={toggleSwitch}
                value={isNicknameEnabled}
              />
              <Text style={styles.label}>Use my Nickname</Text>
            </View>

            <Text style={styles.label}>Birthday</Text>
            <TextInput style={styles.input} value="03/12/1947" />

            <Text style={styles.label}>Gender</Text>
            <TextInput style={styles.input} value="Male" />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phonenumber}
              onChangeText={setPhonenumber}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              maxLength={13}
            />
          </View>
        </View>

        <View style={styles.bottomNavContainer}>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Text>Address</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Text>Devices</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Text>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  profileImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: "hidden",
    borderWidth: 5,
    borderColor: "#9101F0",
    marginBottom: 10,
    marginTop: 45,
  },
  profileImage: {
    width: 126,
    height: 126,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    color: "#000",
  },
  changePicture: {
    color: "#820AD1",
    marginTop: 5,
    fontSize: 16,
  },

  infoContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    width: "100%",
    alignContent: "center",
  },
  label: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
    marginBottom: 5,
    marginTop: 12,
  },
  input: {
    width: 340,
    height: 62,
    borderWidth: 1,
    borderColor: "#F7F4FF",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#f9f9f9",
    color: "#333",
    fontSize: 16,
    marginBottom: 15,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 15,
  },
  switch: {
    marginRight: 10,
  },
  bottomNavContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: "#f7f7f7",
  },
  bottomNavItem: {
    alignItems: "center",
  },
});

export default GeneralSettingsScreen;
