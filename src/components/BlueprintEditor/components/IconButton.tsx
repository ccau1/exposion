import React from "react";
import {
  View,
  Image,
  StyleProp,
  ImageStyle,
  Text,
  TextStyle,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface IconButtonProps {
  text?: string;
  icon: string;
  iconStyle?: StyleProp<ImageStyle>;
  iconSize?: number;
  active?: boolean;
  activeIcon?: string;
  activeIconStyle?: StyleProp<ImageStyle>;
  activeStyle?: StyleProp<ViewStyle>;
  activeTextStyle?: StyleProp<TextStyle>;
  iconAlt?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

export default ({
  text,
  icon,
  iconSize = 35,
  iconAlt = "",
  style,
  iconStyle,
  active,
  activeIcon,
  activeIconStyle,
  activeStyle,
  activeTextStyle,
  disabled,
  onPress,
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "transparent",
          opacity: disabled ? 0.5 : 1,
          justifyContent: "center",
        },
        style,
        ...(active ? [activeStyle] : []),
      ])}
      onPress={disabled ? () => null : onPress}
    >
      <Image
        source={{ uri: active ? activeIcon || icon : icon }}
        style={[
          {
            width: `${iconSize}px`,
            height: `${iconSize}px`,
          },
          iconStyle,
          ...(active ? [activeIconStyle] : []),
        ]}
      />
      <Text
        style={[
          {
            margin: "1px",
          },
          ...(active ? [{ color: "red" }, activeTextStyle] : []),
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};
