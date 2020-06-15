import React, { createContext, CElement, useMemo } from "react";
import { BlueprintState } from "../typings";

export interface BlueprintStateContextProps {
  state: BlueprintState;
  onStateChange: (state: BlueprintState) => void;
  set: (fieldPath: string[], value: any) => void;
  setIs3D: (is3D: boolean) => void;
  setShowMiniMap: (showMiniMap: boolean) => void;
  setSelectedRoom: (roomId: string) => void;
  setSelectedElements: (elementIds: string[]) => void;
  setSelectedControl: (controlType: string) => void;
  setDisableSelection: (disableSelection: boolean) => void;
  showControl: (controlKey: string) => void;
}

export interface BlueprintStateProviderProps {
  state: BlueprintState;
  onStateChange: (state: BlueprintState) => void;
  children?: CElement<any, any>;
}

export const BlueprintStateContext = createContext<BlueprintStateContextProps>(
  null
);

const Provider = ({
  state,
  onStateChange,
  children,
}: BlueprintStateProviderProps) => {
  const value = useMemo(
    () => ({
      state,
      onStateChange,
      set(path: string[], _value: any) {
        const newState = { ...value.state };
        let drilledDownPos = newState;
        // go through each path part
        for (let i = 0; i < path.length; i++) {
          if (i === path.length - 1) {
            // if last item, set value in
            drilledDownPos[path[i]] = _value;
          } else {
            // if not last item, hold the new object position
            drilledDownPos = drilledDownPos[path[i]];
          }
        }
        value.onStateChange(newState);
      },
      setIs3D(is3D: boolean) {
        value.set(["is3D"], is3D);
      },
      setDisableSelection(disableSelection: boolean) {
        value.set(["disableSelection"], disableSelection);
      },
      setMiniMapSize(disableSelection: boolean) {
        value.set(["disableSelection"], disableSelection);
      },
      setShowMiniMap(showMiniMap: boolean) {
        value.set(["showMiniMap"], showMiniMap);
      },
      setSelectedRoom(room: string) {
        value.set(["selected", "room"], room);
      },
      setSelectedElements(elements: string[]) {
        value.set(["selected", "elements"], elements);
      },
      setSelectedControl(control: string) {
        value.set(["selected", "control"], control);
      },
      showControl(controlKey: string) {
        Object.keys(value.state.controlPanels).forEach((cp) => {
          // if (value.state.controlPanels[cp].controls?.includes(controlKey)) {
          value.set(["controlPanels", cp, "controlView"], controlKey);
          // }
        });
      },
    }),
    [state, onStateChange]
  );

  return (
    <BlueprintStateContext.Provider value={value}>
      {children}
    </BlueprintStateContext.Provider>
  );
};

export default {
  ...BlueprintStateContext,
  Provider,
  Consumer: BlueprintStateContext.Consumer,
};
