import React, { SFC } from "react";
import { View, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ButtonProps {
  onPress: () => void;
  children?: SFC | string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default ({ onPress, children, style, textStyle }: ButtonProps) => (
  <TouchableOpacity onPress={onPress}>
    <View style={style}>
      {typeof children === "string" ? (
        <Text style={textStyle}>{children}</Text>
      ) : (
        children
      )}
    </View>
  </TouchableOpacity>
);
