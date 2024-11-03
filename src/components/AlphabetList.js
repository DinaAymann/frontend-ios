import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import colors from "../styles/colors";

const AlphabetList = ({ onLetterSelect }) => {
  const handleLetterSelect = (letter) => {
    Haptics.impactAsync();
    onLetterSelect(letter); // This will call the function provided by the parent component
  };

  return (
    <View style={styles.alphabetContainer}>
      {Array.from(Array(26)).map((_, i) => {
        const letter = String.fromCharCode(65 + i); // Generate letters A-Z
        return (
          <TouchableOpacity
            key={letter}
            onPress={() => handleLetterSelect(letter)} // Handle letter press
          >
            <View style={styles.alphabetLetter}>
              <Text style={styles.alphabetText}>{letter}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  alphabetContainer: {
    position: "absolute",
    right: 0,
    top: "30%",
    width: "10%",
    alignItems: "center",
    zIndex: 1,
  },
  alphabetLetter: {
    paddingVertical: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  alphabetText: {
    fontSize: 16,
    color: "#333",
  },
});

export default AlphabetList;
