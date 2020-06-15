import React, { useContext, useEffect } from "react";
import { BlueprintStateContext } from "../contexts/BlueprintStateContext";
import useHotkey from "../hooks/useHotkey";
import View from "../components/View";
import blueprintControlTypes from "./blueprintControlTypes";
import ControlAreaTabs from "./ControlAreaTabs";
import { BlueprintControlTypeRender } from "../typings";

export default () => {
  const { state, set, showControl } = useContext(BlueprintStateContext);

  const controlPanelSettings = state.controlPanels?.bottom;

  useHotkey(["ctrl", "`"], () => {
    set(["controlPanels", "bottom", "isOpen"], !controlPanelSettings?.isOpen);
  });

  const selectTab = (key: string) => {
    // for all panels
    showControl(key);
    // for specifically bottom panel
    // set(["controlPanels", "bottom", "controlView"], key);
  };

  useEffect(() => {
    if (!blueprintControlTypes[state.controlPanels.bottom.controlView]) {
      set(
        ["controlPanels", "bottom", "controlView"],
        state.controlPanels.bottom.controls?.[0] || ""
      );
    }
  }, [
    state.controlPanels.bottom.controls,
    state.controlPanels.bottom.controlView,
    set,
  ]);

  const Control: BlueprintControlTypeRender = controlPanelSettings?.controlView
    ? blueprintControlTypes[controlPanelSettings.controlView].render
    : () => null;

  return controlPanelSettings?.isOpen ? (
    <View
      style={{
        height: "300px",
        position: "relative",
        borderTop: "1px solid rgba(0, 0, 0, 0.2)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ControlAreaTabs
        controls={state.controlPanels.bottom.controls}
        selectedControl={state.controlPanels.bottom.controlView}
        onTabSelect={selectTab}
      />
      <View
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Control orientation={"horizontal"} />
      </View>
    </View>
  ) : null;
};
