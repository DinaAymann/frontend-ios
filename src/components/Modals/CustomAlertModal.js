import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import colors from "../../styles/colors";
import Typography from "../Typography";

const CustomAlertModal = ({ visible, onClose }) => {
  const [scaleValue] = useState(new Animated.Value(0));
  const [translateYValue] = useState(new Animated.Value(300));
  const [pulseValue] = useState(new Animated.Value(1));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(translateYValue, {
          toValue: 0,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleValue.setValue(0);
      translateYValue.setValue(300);
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={90} style={styles.blurBackground}>
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [
                { scale: scaleValue },
                { translateY: translateYValue },
              ],
            },
          ]}
        >
          <Typography
            text={"🚀 Feature Coming Soon!"}
            size={23}
            color={colors.complementaryYellow}
            fontFamily="Cairo-Medium"
            textShadowColor={colors.black}
            textShadowOffset={{ width: 1, height: 1 }}
            style={styles.alertText}
          />

          <Animated.View
            style={[
              styles.okButtonContainer,
              { transform: [{ scale: pulseValue }] },
            ]}
          >
            <TouchableOpacity style={styles.okButton} onPress={onClose}>
              <Typography
                text={"OK"}
                color={colors.purple}
                size={18}
                fontFamily="Cairo-Bold"
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  alertContainer: {
    width: "80%",
    maxWidth: 400,
    padding: 25,
    backgroundColor:
      "linear-gradient(180deg, rgba(84, 22, 119, 1) 0%, rgba(110, 38, 146, 1) 100%)",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: colors.complementaryYellow,
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
    borderColor: colors.complementaryYellow,
    borderWidth: 2,
  },
  alertText: {
    fontSize: 24,
    color: colors.complementaryYellow,
    textAlign: "center",
    fontWeight: "800",
    marginBottom: 20,
    textShadowColor: colors.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  okButtonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  okButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: colors.complementaryYellow,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    shadowColor: colors.complementaryYellow,
    shadowRadius: 20,
    shadowOpacity: 0.9,
  },
});

export default CustomAlertModal;
