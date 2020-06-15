import React, { useContext, Fragment } from "react";
import BlueprintCanvas from "../BlueprintCanvas";
import { BlueprintState, Blueprint, BlueprintCanvasPanelRow } from "../typings";
import styles from "../styles";
import { PanelContext } from "../contexts/PanelContext";
import BlueprintPanel from "./BlueprintPanel";

interface BlueprintCanvasPanelRowProps {
  panelRow: BlueprintCanvasPanelRow;
  blueprintState: BlueprintState;
  blueprint: Blueprint;
  onBlueprintChange: (blueprint: Blueprint) => void;
  onBlueprintStateChange: (blueprintState: BlueprintState) => void;
}

const InnerBlueprintCanvasPanelRow = ({
  panelRow,
  blueprintState,
  blueprint,
  onBlueprintChange = () => null,
  onBlueprintStateChange = () => null,
}: BlueprintCanvasPanelRowProps) => {
  const { getPanelById } = useContext(PanelContext);
  return (
    <Fragment>
      {panelRow.panel && (
        <BlueprintPanel
          panelState={getPanelById(panelRow.panel)}
          blueprint={blueprint}
          blueprintState={blueprintState}
          onBlueprintChange={onBlueprintChange}
          onBlueprintStateChange={onBlueprintStateChange}
        />
      )}
      {(panelRow.columns || []).map((panelColumn, panelColumnIndex) => {
        return (
          <Fragment>
            <div style={styles.panelColumn} key={panelColumnIndex}>
              <InnerBlueprintCanvasPanelRow
                panelRow={panelColumn}
                blueprint={blueprint}
                blueprintState={blueprintState}
                onBlueprintChange={onBlueprintChange}
                onBlueprintStateChange={onBlueprintStateChange}
              />
            </div>
            {panelColumnIndex < blueprintState.panelsLayout.length - 1 && (
              <div
                style={{ width: "3px", backgroundColor: "rgba(0, 0, 0, 0.2)" }}
              />
            )}
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default InnerBlueprintCanvasPanelRow;
