import React from "react";
import BlueprintControls from "./BlueprintControls";
import { Blueprint, BlueprintState } from "./typings";
import BlueprintContext from "./contexts/BlueprintContext";
import BlueprintStateContext from "./contexts/BlueprintStateContext";
import CanvasContext from "./contexts/CanvasContext";
import BlueprintCanvasPanels from "./BlueprintPanels/BlueprintPanels";
import PanelContext from "./contexts/PanelContext";
import BlueprintHistoryContext from "./contexts/BlueprintHistoryContext";

export interface BlueprintEditorProps {
  blueprintState: BlueprintState;
  blueprint: Blueprint;
  onBlueprintChange: (blueprint: Blueprint) => void;
  onBlueprintStateChange: (blueprintState: BlueprintState) => void;
}

export default ({
  blueprint = {
    elements: [],
    corners: [],
  },
  onBlueprintChange = () => null,
  blueprintState = {
    controlPanels: {
      bottom: {
        tabView: "",
        isOpen: true,
        controlView: "",
        controls: ["form", "addElement", "code"],
      },
      left: {
        tabView: "",
        isOpen: true,
        controlView: "",
        controls: ["form", "addElement"],
      },
    },
    disableSelection: false,
    panels: [
      {
        _id: "5eddbb009a45849e28c9e86e",
        is3D: false,
        showMiniMap: true,
        screenOffset: { x: 0, y: 0, z: 0 },
        scale: 1,
        rotate: { x: 0, y: 0 },
      },
    ],
    panelsLayout: [
      {
        _id: "5eddd0ea1edb321d44a63ce3",
        panel: "5eddbb009a45849e28c9e86e",
      },
    ],
    selected: {
      elements: [],
      control: null,
    },
    showMiniMap: true,
  },
  onBlueprintStateChange = () => null,
}: BlueprintEditorProps) => {
  return (
    <CanvasContext.Provider>
      <BlueprintStateContext.Provider
        state={blueprintState}
        onStateChange={onBlueprintStateChange}
      >
        <PanelContext.Provider>
          <BlueprintContext.Provider
            blueprint={blueprint}
            onBlueprintChange={onBlueprintChange}
          >
            <BlueprintHistoryContext.Provider
              onBlueprintChange={onBlueprintChange}
            >
              <BlueprintControls
                blueprint={blueprint}
                onBlueprintChange={onBlueprintChange}
                blueprintState={blueprintState}
                onBlueprintStateChange={onBlueprintStateChange}
              >
                <BlueprintCanvasPanels
                  blueprintState={blueprintState}
                  blueprint={blueprint}
                  onBlueprintChange={onBlueprintChange}
                  onBlueprintStateChange={onBlueprintStateChange}
                />
              </BlueprintControls>
            </BlueprintHistoryContext.Provider>
          </BlueprintContext.Provider>
        </PanelContext.Provider>
      </BlueprintStateContext.Provider>
    </CanvasContext.Provider>
  );
};
