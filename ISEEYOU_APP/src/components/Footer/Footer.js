import React from "react";
import {
  Button,
  View,
  Text,
  Image,
  Easing,
  Dimensions,
  TouchableHighlight
} from "react-native";
import Images from "@assets/images";
const { width, height } = Dimensions.get("window");
let styles = {
  footerIcon: {
    height: height * 0.038,
    resizeMode: "contain"
  },
  footerIconContainer: { flex: 1, alignItems: "center" }
};

export default class Footer extends React.Component {
  render() {
    return (
      <View
        borderTopColor="#e7e7ea"
        borderTopWidth={0.5}
        backgroundColor="#ffffff"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        flex={1}
      />
    );
  }
}
