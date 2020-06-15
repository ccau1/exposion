import React from "react";
import Button from "../components/Button";
// import styles from "../styles";
import View from "../components/View";
import { StyleSheet } from "react-native";

interface BlueprintPanelDimensionSwitcherProps {
  is3D: boolean;
  onChange: (newIs3D: boolean) => void;
}

export default ({ is3D, onChange }: BlueprintPanelDimensionSwitcherProps) => {
  return (
    <View>
      <Button
        style={[
          styles.panelButton,
          ...(!is3D ? [styles.panelButtonActive] : []),
        ]}
        onPress={() => onChange(false)}
      >
        2D
      </Button>
      <Button
        style={[
          styles.panelButton,
          ...(is3D ? [styles.panelButtonActive] : []),
        ]}
        onPress={() => onChange(true)}
      >
        3D
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  panelButton: {
    padding: "5px",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  panelButtonActive: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});
