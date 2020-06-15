import React from "react";
import View from "./View";

interface TextInputProps {
  value: string;
  onChange?: (value: string) => void;
  icon?: string;
  accessory?: string;
  placeholder?: string;
}

export default ({ value, onChange, placeholder, icon }: TextInputProps) => {
  return (
    <View
      style={{
        // border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
      }}
    >
      <input
        placeholder={placeholder}
        type="text"
        style={{
          padding: "10px 15px",
          backgroundColor: "transparent",
        }}
      />
    </View>
  );
};
