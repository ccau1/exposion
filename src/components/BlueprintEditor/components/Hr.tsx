import React from "react";
import View from "./View";
import { CSSProperties } from "react";

interface HrProps {
  vertical?: boolean;
  size?: number;
  color?: string;
  padding?: number | string;
  width?: number | string;
}

export default ({
  vertical,
  size = 1,
  width = "80%",
  color = "rgba(0, 0, 0, 0.2)",
  padding = 5,
}: HrProps) => {
  const hrStyle: CSSProperties = {
    backgroundColor: color,
    margin: padding,
  };

  if (vertical) {
    hrStyle.width = size;
    hrStyle.height = width;
    hrStyle.margin = "auto 0";
  } else {
    hrStyle.height = size;
    hrStyle.width = width;
    hrStyle.margin = "0 auto";
  }

  return <View style={hrStyle} />;
};
