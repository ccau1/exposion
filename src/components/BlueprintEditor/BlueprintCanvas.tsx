import React from "react";
import BlueprintCanvas2d from "./BlueprintCanvas2d";
import BlueprintCanvas3d from "./BlueprintCanvas3d";
import { BlueprintState, Blueprint, BlueprintPanelState } from "./typings";
import TouchTrackerContext from "./contexts/TouchTrackerContext";

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
  return (
    <TouchTrackerContext.Provider>
      {panelState.is3D ? (
        <BlueprintCanvas3d
          panelState={panelState}
          blueprint={blueprint}
          blueprintState={blueprintState}
          onBlueprintChange={onBlueprintChange}
          onBlueprintStateChange={onBlueprintStateChange}
        />
      ) : (
        <BlueprintCanvas2d
          panelState={panelState}
          blueprint={blueprint}
          blueprintState={blueprintState}
          onBlueprintChange={onBlueprintChange}
          onBlueprintStateChange={onBlueprintStateChange}
        />
      )}
    </TouchTrackerContext.Provider>
  );
};
