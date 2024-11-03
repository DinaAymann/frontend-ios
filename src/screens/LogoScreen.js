import React, { useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  PanResponder,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PropTypes from "prop-types";
const { width, height } = Dimensions.get("window");

const LogoScreen = ({ navigation }) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          navigation.navigate("WelcomeScreen");
        }
        if (gestureState.dy < -50) {
          navigation.navigate("WelcomeScreen");
        }
      },
    })
  ).current;

  return (
    <View style={styles.fullScreenWrapper} {...panResponder.panHandlers}>
      <LinearGradient colors={["#FFFF", "#FFFF"]} style={styles.container}>
        <View style={styles.container}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        </View>
      </LinearGradient>
    </View>
  );
};
LogoScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  fullScreenWrapper: {
    flex: 1,
    width: width,
    height: height,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 114,
    height: 114,
    resizeMode: "contain",
  },
});

export default LogoScreen;
