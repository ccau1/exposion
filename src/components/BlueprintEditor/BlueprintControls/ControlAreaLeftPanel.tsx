import React, { useContext, useEffect, SFC } from "react";
import { BlueprintStateContext } from "../contexts/BlueprintStateContext";
import useHotkey from "../hooks/useHotkey";
import blueprintControlTypes from "./blueprintControlTypes";
import ControlAreaTabs from "./ControlAreaTabs";
import { BlueprintControlTypeRender } from "../typings";
import View from "../components/View";

export default () => {
  const { state, set, showControl } = useContext(BlueprintStateContext);

  const controlPanelSettings = state.controlPanels?.left;

  useHotkey(["ctrl", "b"], () => {
    set(
      ["controlPanels", "left", "isOpen"],
      !state.controlPanels?.left?.isOpen
    );
  });

  const selectTab = (key: string) => {
    // for all panels
    showControl(key);
    // for specifically left panel
    // set(["controlPanels", "left", "controlView"], key);
  };

  useEffect(() => {
    if (!blueprintControlTypes[state.controlPanels.left.controlView]) {
      set(
        ["controlPanels", "left", "controlView"],
        state.controlPanels.left.controls?.[0] || ""
      );
    }
  }, [
    state.controlPanels.left.controls,
    state.controlPanels.left.controlView,
    set,
  ]);

  const Control: BlueprintControlTypeRender = controlPanelSettings?.controlView
    ? blueprintControlTypes[controlPanelSettings.controlView].render
    : () => null;

  return state.controlPanels?.left?.isOpen ? (
    <View
      style={{
        width: "300px",
        maxWidth: "100%",
        borderRight: "1px solid rgba(0, 0, 0, 0.2)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ControlAreaTabs
        style={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
          whiteSpace: "nowrap",
          overflowX: "auto",
        }}
        controls={state.controlPanels.left.controls}
        selectedControl={state.controlPanels.left.controlView}
        onTabSelect={selectTab}
      />
      <View style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Control orientation={"vertical"} />
      </View>
    </View>
  ) : null;
};
