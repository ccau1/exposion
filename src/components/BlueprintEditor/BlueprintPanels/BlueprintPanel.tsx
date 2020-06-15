import React, { useContext, useMemo } from "react";
import BlueprintCanvas from "../BlueprintCanvas";
import { BlueprintState, Blueprint, BlueprintPanelState } from "../typings";
import BlueprintPanelDimensionSwitcher from "./BlueprintPanelDimensionSwitcher";
import { PanelContext } from "../contexts/PanelContext";
// import BlueprintPanelSplitButtons from "./BlueprintPanelSplitButtons";

interface BlueprintCanvasProps {
  blueprintState: BlueprintState;
  blueprint: Blueprint;
  panelState: BlueprintPanelState;
  onBlueprintChange: (blueprint: Blueprint) => void;
  onBlueprintStateChange: (blueprintState: BlueprintState) => void;
}

export default ({
  blueprintState,
  blueprint,
  panelState,
  onBlueprintChange = () => null,
  onBlueprintStateChange = () => null,
}: BlueprintCanvasProps) => {
  const {
    updatePanel,
    // splitPanel,
    panels,
  } = useContext(PanelContext);
  const miniMapSize = blueprintState.miniMapSize || 200;
  const miniMapPanelState = useMemo(
    () => ({ ...panelState, showMiniMap: false, is3D: !panelState.is3D }),
    [panelState]
  );
  const miniMapBlueprintState = useMemo(
    () => ({ ...blueprintState, disableSelection: true }),
    [blueprintState]
  );

  return (
    <div style={{ position: "relative", flex: 1, display: "flex" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 100,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {panels.length > 1 && (
          <BlueprintPanelDimensionSwitcher
            is3D={panelState.is3D}
            onChange={(newIs3D) =>
              updatePanel(panelState._id, { ...panelState, is3D: newIs3D })
            }
          />
        )}
        {/* <BlueprintPanelSplitButtons
          onSplit={(direction) => splitPanel(panelState._id, direction)}
        /> */}
      </div>
      {panelState.showMiniMap && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: miniMapSize,
            height: miniMapSize,
            maxWidth: "100%",
            maxHeight: "100%",
            zIndex: 100,
          }}
        >
          <BlueprintCanvas
            panelState={miniMapPanelState}
            blueprint={blueprint}
            onBlueprintChange={onBlueprintChange}
            blueprintState={miniMapBlueprintState}
            onBlueprintStateChange={onBlueprintStateChange}
          />
        </div>
      )}
      <BlueprintCanvas
        panelState={panelState}
        blueprint={blueprint}
        blueprintState={blueprintState}
        onBlueprintChange={onBlueprintChange}
        onBlueprintStateChange={onBlueprintStateChange}
      />
    </div>
  );
};
