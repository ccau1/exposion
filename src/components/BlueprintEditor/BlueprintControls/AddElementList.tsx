import React, { useContext } from "react";
import styles from "../styles";
import elementTypes from "../elementTypes";
import { Blueprint } from "../typings";
import { BlueprintContext } from "../contexts/BlueprintContext";
import Button from "../components/Button";

interface BlueprintControlLeftPanelProps {
  blueprint: Blueprint;
  onBlueprintChange: (blueprint: Blueprint) => void;
}

export default ({
  blueprint,
  onBlueprintChange,
}: BlueprintControlLeftPanelProps) => {
  const { addElement } = useContext(BlueprintContext);
  // const {mousePosition} = useContext(EventTrackerContext);
  return (
    <div>
      {Object.values(elementTypes || {}).map((elementType) => (
        <Button
          key={elementType.key}
          style={styles.elementTypeButton}
          onPress={() => addElement(elementType.key)}
        >
          {elementType.name}
        </Button>
      ))}
    </div>
  );
};
