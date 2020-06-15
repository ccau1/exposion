import React, { Fragment } from "react";
import { BlueprintState, Blueprint } from "../typings";
import styles from "../styles";
import BlueprintCanvasPanelRow from "./BlueprintPanelRow";
import BlueprintPanelActions from "./BlueprintPanelActions";
import View from "../components/View";

interface BlueprintCanvasPanelsProps {
  blueprintState: BlueprintState;
  blueprint: Blueprint;
  onBlueprintChange: (blueprint: Blueprint) => void;
  onBlueprintStateChange: (blueprintState: BlueprintState) => void;
}

export default ({
  blueprintState,
  blueprint,
  onBlueprintChange = () => null,
  onBlueprintStateChange = () => null,
}: BlueprintCanvasPanelsProps) => {
  return (
    <View style={styles.panelsContainer}>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <BlueprintPanelActions />
      </View>
      {blueprintState.panelsLayout.map((panelRow, panelRowIndex) => {
        return (
          <Fragment key={panelRow._id}>
            <View style={styles.panelRow}>
              <BlueprintCanvasPanelRow
                panelRow={panelRow}
                blueprint={blueprint}
                blueprintState={blueprintState}
                onBlueprintChange={onBlueprintChange}
                onBlueprintStateChange={onBlueprintStateChange}
              />
            </View>
            {panelRowIndex < blueprintState.panelsLayout.length - 1 && (
              <View
                style={{ height: "3px", backgroundColor: "rgba(0, 0, 0, 0.2)" }}
              />
            )}
          </Fragment>
        );
      })}
    </View>
  );
};
