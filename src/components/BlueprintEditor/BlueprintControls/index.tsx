import React from "react";
import { Blueprint, BlueprintState } from "../typings";
import styles from "../styles";
import ControlAreaBottomPanel2 from "./ControlAreaBottomPanel2";
import ControlAreaLeftPanel from "./ControlAreaLeftPanel";
import View from "../components/View";
import ControlAreaHeader from "./ControlAreaHeader";

export interface BlueprintControlProps {
  children: any;
  blueprint: Blueprint;
  onBlueprintChange: (blueprint: Blueprint) => void;
  blueprintState: BlueprintState;
  onBlueprintStateChange: (blueprintState: BlueprintState) => void;
}

export default ({ children }: BlueprintControlProps) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",
      }}
    >
      <ControlAreaHeader />
      <View style={styles.controlPanelsContainer}>
        <ControlAreaLeftPanel />
        <View style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <View style={{ flex: 1 }}>{children}</View>
          <ControlAreaBottomPanel2 />
        </View>
      </View>
    </View>
  );
};
