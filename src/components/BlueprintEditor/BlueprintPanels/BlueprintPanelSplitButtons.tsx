import React from "react";
import View from "../components/View";
import Button from "../components/Button";
import styles from "../styles";

interface BlueprintPanelSplitButtonsProps {
  onSplit: (direction: "horizontal" | "vertical") => void;
}

export default ({ onSplit }: BlueprintPanelSplitButtonsProps) => {
  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <Button
        style={{ ...styles.panelButton }}
        onPress={() => onSplit("horizontal")}
      >
        Split -
      </Button>
      <Button
        style={{ ...styles.panelButton }}
        onPress={() => onSplit("vertical")}
      >
        Split |
      </Button>
    </View>
  );
};
