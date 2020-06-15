import React, { useContext, useEffect } from "react";
import { BlueprintStateContext } from "../contexts/BlueprintStateContext";
import useHotkey from "../hooks/useHotkey";
import View from "../components/View";
import blueprintControlTypes from "./blueprintControlTypes";
import { BlueprintControlTypeRender } from "../typings";
import IconButton from "../components/IconButton";
import Toolbar from "../components/Toolbar";

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
  }, []);

  const controlType = blueprintControlTypes[controlPanelSettings.controlView];

  const Control: BlueprintControlTypeRender = controlPanelSettings?.controlView
    ? controlType.render
    : () => null;

  const ToolbarComponent = controlType?.toolbar || null;

  return controlPanelSettings?.isOpen ? (
    <View style={{ minHeight: "130px" }}>
      {state.controlPanels.bottom.controlView && (
        <View
          style={{
            height: "400px",
            position: "relative",
            borderTop: "1px solid rgba(0, 0, 0, 0.2)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            paddingBottom: "100px",
            backgroundColor: "#f0f0f0",
          }}
        >
          {/* <ControlAreaTabs
          controls={state.controlPanels.bottom.controls}
          selectedControl={state.controlPanels.bottom.controlView}
          onTabSelect={selectTab}
        /> */}
          {controlType.toolbar && ToolbarComponent && (
            <Toolbar>
              <ToolbarComponent controlType={controlType} />
            </Toolbar>
          )}
          <View
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              paddingBottom: "30px",
            }}
          >
            <Control orientation={"horizontal"} />
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "130px",
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 42%, rgba(255,255,255,0) 100%)",
            }}
          />
        </View>
      )}
      <View
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1000px",
          maxWidth: "100%",
          height: "100px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderRadius: "10px",
            maxWidth: "100%",
            height: "100%",
          }}
        >
          {state.controlPanels.bottom.controls.map((control) => (
            <IconButton
              key={control}
              style={{ height: "100%", minWidth: "90px" }}
              icon={blueprintControlTypes[control].icon || ""}
              activeIcon={blueprintControlTypes[control].iconActive || ""}
              text={control}
              active={state.controlPanels.bottom.controlView === control}
              onPress={() =>
                state.controlPanels.bottom.controlView === control
                  ? selectTab("")
                  : selectTab(control)
              }
            />
          ))}
          {/* <IconButton
            style={{ height: "100%", width: "90px" }}
            icon={"../assets/Group 14690.png"}
            text="建立平面圖"
          />
          <IconButton
            style={{ height: "100%", width: "90px" }}
            icon={"../assets/Group 14690.png"}
            text="繪製工具"
          />
          <IconButton
            style={{ height: "100%", width: "90px" }}
            icon={"../assets/Group 14690.png"}
            text="參考案例"
          />
          <Hr width="50%" vertical />
          <IconButton
            style={{ height: "100%", width: "90px" }}
            icon={"../assets/Group 14690.png"}
            text="傢俬"
          />
          <IconButton
            style={{ height: "100%", width: "90px" }}
            icon={"../assets/Group 14690.png"}
            text="色彩 / 物料"
          />
          <Hr width="50%" vertical />
          <IconButton
            style={{ height: "100%", width: "90px" }}
            icon={"../assets/Group 14690.png"}
            text="環境光"
          />
          <IconButton
            style={{ height: "100%", width: "90px" }}
            icon={"../assets/Group 14690.png"}
            text="測量"
          />
          <IconButton
            style={{ height: "100%", width: "90px" }}
            icon={"../assets/Group 14690.png"}
            text="效果圖"
          /> */}
        </View>
      </View>
    </View>
  ) : null;
};
