import React, { CElement } from "react";
import View from "./View";

interface ToolbarProps {
  children: CElement<any, any>;
}

export default ({ children }: ToolbarProps) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: "45px",
        marginBottom: "10px",
        backgroundColor: "white",
        padding: "3px 10px",
      }}
    >
      {children}
    </View>
  );
};
