import React, { createContext, CElement, useMemo, useContext } from "react";
import { ObjectID } from "bson";
import { BlueprintPanelState, BlueprintCanvasPanelRow } from "../typings";
import { BlueprintStateContext } from "./BlueprintStateContext";

interface SelectableElement {
  elementId: string;
  controlType?: string;
}

export interface PanelContextProps {
  panels: BlueprintPanelState[];
  panelsLayout: BlueprintCanvasPanelRow[];
  newPanel: (fields: any) => BlueprintPanelState;
  setAllPanels: (paths: string | string[], value) => void;
  getPanelById: (panelId: string) => BlueprintPanelState;
  updatePanel: (panelId: string, panel: BlueprintPanelState) => void;
  splitPanel: (panelId: string, direction: "horizontal" | "vertical") => void;
  transformPanels: (
    fn: (
      panelRow: BlueprintCanvasPanelRow,
      panels: BlueprintPanelState[],
      panelsLayout: BlueprintCanvasPanelRow[],
      endFn: () => void
    ) => {
      panelsLayout: BlueprintCanvasPanelRow[];
      panels: BlueprintPanelState[];
    },
    panels: BlueprintPanelState[],
    panelsLayout: BlueprintCanvasPanelRow[]
  ) => {
    panelsLayout: BlueprintCanvasPanelRow[];
    panels: BlueprintPanelState[];
  };
}

export interface CanvasProviderProps {
  children?: CElement<any, any>;
}

export const PanelContext = createContext<PanelContextProps>(null);

const Provider = ({ children }: CanvasProviderProps) => {
  const { state, onStateChange } = useContext(BlueprintStateContext);
  const value = useMemo<PanelContextProps>(
    () => ({
      panels: state.panels,
      panelsLayout: state.panelsLayout,
      newPanel(fields) {
        return {
          _id: new ObjectID().toString(),
          is3D: false,
          showMiniMap: false,
          screenOffset: { x: 0, y: 0, z: 0 },
          cameraOffset: { x: 0, y: 0, z: 0 },
          scale: 1,
          rotate: { x: 0, y: 0 },
          ...fields,
        } as BlueprintPanelState;
      },
      getPanelById(panelId: string) {
        return value.panels.find((p) => p._id === panelId);
      },
      setAllPanels(paths: string | string[], value: any) {
        onStateChange({
          ...state,
          panels: state.panels.map((p) => {
            if (typeof paths === "string") {
              p[paths] = value;
            } else {
              paths.reduce((obj, path, pathIndex) => {
                if (paths.length - 1 === pathIndex) {
                  // last item, set it here
                  obj[path] = value;
                } else {
                  obj = obj[path];
                }
                return obj;
              }, p);
            }
            return p;
          }),
        });
      },
      updatePanel(panelId: string, panel: BlueprintPanelState) {
        onStateChange({
          ...state,
          panels: state.panels.map((p) => (p._id === panelId ? panel : p)),
        });
      },
      // _splitPanel(
      //   panelId: string,
      //   direction: "horizontal" | "vertical",
      //   panelsLayout: BlueprintCanvasPanelRow[] = value.panelsLayout
      // ): {
      //   panels: BlueprintPanelState;
      //   panelsLayout: BlueprintCanvasPanelRow[];
      // } {
      //   panelsLayout.forEach((pl) => {
      //     if (pl.panel === panelId) {
      //       // found panel, split it
      //       switch (direction) {
      //         case "vertical":
      //           pl.columns.push(pl.panel);
      //           break;
      //       }
      //     }
      //     if (pl.columns?.length) {
      //     }
      //   });
      // },
      transformPanels(
        fn: (
          panelRow: BlueprintCanvasPanelRow,
          panels: BlueprintPanelState[],
          panelsLayout: BlueprintCanvasPanelRow[],
          endFn: () => void
        ) => {
          panelsLayout: BlueprintCanvasPanelRow[];
          panels: BlueprintPanelState[];
        },
        panels: BlueprintPanelState[],
        panelsLayout: BlueprintCanvasPanelRow[]
      ): {
        panelsLayout: BlueprintCanvasPanelRow[];
        panels: BlueprintPanelState[];
      } {
        const result = {
          panels: [...panels],
          panelsLayout: [...panelsLayout],
        };
        let isEnd = false;
        const endFn = () => (isEnd = true);
        for (let i = 0; i < panelsLayout.length; i++) {
          if (panelsLayout[i].panel) {
            const { panels: _panels, panelsLayout: _panelsLayout } = fn(
              panelsLayout[i],
              result.panels,
              result.panelsLayout,
              endFn
            );
            result.panels = _panels;
            result.panelsLayout = _panelsLayout;
          }
          if (isEnd) break;
          if (panelsLayout[i].columns?.length) {
            const {
              panels: _panels,
              panelsLayout: _panelsLayout,
            } = value.transformPanels(
              fn,
              result.panels,
              panelsLayout[i].columns
            );
            result.panels = _panels;
            result.panelsLayout = _panelsLayout;
          }
          if (isEnd) break;
          // if end, break out of loop already
        }
        return result;
      },
      splitPanel(panelId: string, direction: "horizontal" | "vertical") {
        console.log("splitting", panelId, direction);

        const result = value.transformPanels(
          (panelRow, panels, panelsLayout, end) => {
            const newPanels = [...panels];
            const newPanelsLayout = [...panelsLayout];
            if (panelRow.panel === panelId) {
              console.log("before", newPanels, newPanelsLayout);

              switch (direction) {
                case "vertical":
                  if (!panelRow.columns) {
                    panelRow.columns = [];
                  }
                  if (panelRow.panel) {
                    const panel = value.getPanelById(panelRow.panel);
                    panelRow.columns.push({
                      _id: new ObjectID().toString(),
                      panel: panelRow.panel,
                      columns: [],
                    });
                    // add new panel
                    const newPanel = value.newPanel(panel);
                    newPanels.push(newPanel);
                    panelRow.columns.push({
                      _id: new ObjectID().toString(),
                      panel: newPanel._id,
                      columns: [],
                    });
                    panelRow.panel = null;
                  }
                  break;
                case "horizontal":
                  // TODO: add new row below this
                  break;
              }
              end();
            }
            console.log("transformed", {
              panels: newPanels,
              panelsLayout: newPanelsLayout,
            });

            return { panels: newPanels, panelsLayout: newPanelsLayout };
          },
          value.panels,
          value.panelsLayout
        );

        onStateChange({
          ...state,
          ...result,
        });
      },
    }),
    [onStateChange, state]
  );

  return (
    <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
  );
};

export default {
  ...PanelContext,
  Provider,
  Consumer: PanelContext.Consumer,
};
