import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Button from "./Button";

interface TabItem {
  value: string;
  text: string;
}

interface TabsProps {
  style?: StyleProp<ViewStyle>;
  selected?: string;
  items: TabItem[];
  onSelect?: (value: string, item: TabItem) => void;
  horizontal?: boolean;
}

export default ({
  style,
  items,
  selected,
  onSelect = () => null,
  horizontal,
}: TabsProps) => {
  return (
    <View
      style={StyleSheet.flatten([
        {
          borderBottomWidth: 1,
          borderStyle: "solid",
          borderBottomColor: horizontal ? "rgba(0, 0, 0, 0.2)" : "transparent",
          whiteSpace: "nowrap",
          overflowX: "auto",
        },
        style,
      ])}
    >
      {items.map((item) => {
        return (
          <Button
            key={item.value}
            style={styles.buttonStyle}
            textStyle={[
              styles.buttonTextStyle,
              selected === item.value ? styles.buttonSelectedTextStyle : {},
            ]}
            onPress={() => onSelect(item.value, item)}
          >
            {item.text}
          </Button>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    padding: "10px 15px",
    backgroundColor: "transparent",
  },
  buttonTextStyle: {
    color: "rgba(0, 0, 0, 0.5)",
  },
  buttonSelectedTextStyle: {
    color: "rgba(0, 0, 0, 1)",
  },
});
