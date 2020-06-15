import React, { CSSProperties } from "react";
import Tabs from "../components/Tabs";
import blueprintControlTypes from "./blueprintControlTypes";

interface ControlAreaTabsProps {
  controls: string[];
  selectedControl: string;
  onTabSelect?: (controlKey: string) => void;
  style?: CSSProperties;
}

export default ({
  controls = [],
  selectedControl,
  onTabSelect = () => null,
}: ControlAreaTabsProps) => {
  return (
    <Tabs
      items={[...new Set(controls)].map((c) => ({ value: c, text: c }))}
      selected={selectedControl}
      onSelect={(val) => onTabSelect(blueprintControlTypes[val].key)}
      horizontal
    />
  );
};
