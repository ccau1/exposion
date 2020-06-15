import React, { useContext } from "react";
import View from "../components/View";
import IconButton from "../components/IconButton";
import Hr from "../components/Hr";
import { PanelContext } from "../contexts/PanelContext";
import { BlueprintHistoryContext } from "../contexts/BlueprintHistoryContext";
import useHotkey from "../hooks/useHotkey";

export default () => {
  const { setAllPanels, panels } = useContext(PanelContext);
  const { undo, redo, isRedoEnd, isUndoEnd } = useContext(
    BlueprintHistoryContext
  );

  useHotkey(["ctrl", "2"], () => {
    setAllPanels("is3D", false);
  });
  useHotkey(["ctrl", "3"], () => {
    setAllPanels("is3D", true);
  });
  useHotkey(["ctrl", "["], () => {
    undo();
  });
  useHotkey(["ctrl", "]"], () => {
    redo();
  });

  return (
    <View
      style={{
        height: "80px",
        borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
      }}
    >
      <View
        style={{
          width: "1000px",
          maxWidth: "100%",
          height: "100%",
          overflowX: "auto",
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          style={{ height: "100%", width: "90px" }}
          activeStyle={{ backgroundColor: "red" }}
          activeTextStyle={{ color: "white" }}
          icon={"/blueprintEditor/icon_save@3x.png"}
          text="Save"
        />
        <IconButton
          style={{ height: "100%", width: "90px" }}
          activeStyle={{ backgroundColor: "red" }}
          activeTextStyle={{ color: "white" }}
          icon={"/blueprintEditor/icon_export@3x.png"}
          text="Export"
        />
        <Hr width="50%" vertical />
        <IconButton
          style={{ height: "100%", width: "90px" }}
          activeStyle={{ backgroundColor: "red" }}
          activeTextStyle={{ color: "white" }}
          icon={"/blueprintEditor/icon_undo@3x.png"}
          text="Undo"
          disabled={isUndoEnd()}
          onPress={undo}
        />
        <IconButton
          style={{ height: "100%", width: "90px" }}
          activeStyle={{ backgroundColor: "red" }}
          activeTextStyle={{ color: "white" }}
          icon={"/blueprintEditor/icon_redo@3x.png"}
          text="Redo"
          disabled={isRedoEnd()}
          onPress={redo}
        />
        <Hr width="50%" vertical />
        <IconButton
          style={{ height: "100%", width: "90px" }}
          activeStyle={{ backgroundColor: "red" }}
          activeTextStyle={{ color: "white" }}
          icon={"/blueprintEditor/icon_2d@3x.png"}
          text="2D"
          active={panels.every((p) => !p.is3D)}
          onPress={() => setAllPanels("is3D", false)}
        />
        <IconButton
          style={{ height: "100%", width: "90px" }}
          activeStyle={{ backgroundColor: "red" }}
          activeTextStyle={{ color: "white" }}
          icon={"/blueprintEditor/icon_3d@3x.png"}
          text="3D"
          active={panels.every((p) => p.is3D)}
          onPress={() => setAllPanels("is3D", true)}
        />
        <Hr width="50%" vertical />
        <IconButton
          style={{ height: "100%", width: "90px" }}
          activeStyle={{ backgroundColor: "red" }}
          activeTextStyle={{ color: "white" }}
          icon={"/blueprintEditor/icon_notifications@3x.png"}
          text="Notifications"
        />
      </View>
    </View>
  );
};
