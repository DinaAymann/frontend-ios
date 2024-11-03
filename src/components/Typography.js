import React from "react";
import styled from "styled-components/native";
import colors from "../styles/colors";
const perfectSize = (size) => size;
import { useFonts } from "expo-font";

const Typography = ({
  text,
  color = colors.black,
  size = 16,
  noLimit = false,
  maxChar = "auto",
  fontFamily = "Cairo-Regular",
  textAlign = "center",

  ...props
}) => {
  const renderText = () => {
    if (noLimit) return text;
    if (text && text.length >= maxChar) {
      return `${text.slice(0, maxChar)}...`;
    }
    return text;
  };

  const [fontsLoaded] = useFonts({
    "Cairo-Black": require("../assets/fonts/Cairo/Cairo-Black.ttf"),
    "Cairo-Bold": require("../assets/fonts/Cairo/Cairo-Bold.ttf"),
    "Cairo-Regular": require("../assets/fonts/Cairo/Cairo-Regular.ttf"),
    "Cairo-Medium": require("../assets/fonts/Cairo/Cairo-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Text
      size={perfectSize(size)}
      color={color}
      fontFamily={fontFamily}
      textAlign={textAlign}
    >
      {renderText()}
    </Text>
  );
};

export default Typography;

const Text = styled.Text`
  font-size: ${(props) => props.size}px;
  color: ${(props) => props.color};
  font-family: ${(props) => props.fontFamily};
  text-align: ${(props) => props.textAlign};
  line-height: ${(props) => props.size * 2}px;
`;
