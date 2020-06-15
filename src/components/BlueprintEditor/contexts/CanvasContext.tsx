import React, { CElement, useState, useMemo, createContext } from "react";
import { Position3D, Position2D, Blueprint } from "../typings";
import elementTypes from "../elementTypes";

interface SelectableElement {
  elementId: string;
  controlType?: string;
}

export interface CanvasContextProps {
  selectableElements2D: SelectableElement[];
  setSelectableElements2D: (selectableElements2D: SelectableElement[]) => void;
  selectableElements3D: SelectableElement[];
  setSelectableElements3D: (selectableElements3D: SelectableElement[]) => void;
  getSelectableElementByPosition2D: (
    position: Position2D,
    blueprint: Blueprint
  ) => SelectableElement;
  getSelectableElementByPosition3D: (
    position: Position3D,
    blueprint: Blueprint
  ) => SelectableElement;
}

export interface CanvasProviderProps {
  children?: CElement<any, any>;
}

export const CanvasContext = createContext<CanvasContextProps>(null);

const Provider = ({ children }: CanvasProviderProps) => {
  const [selectableElements2D, setSelectableElements2D] = useState<
    SelectableElement[]
  >([]);
  const [selectableElements3D, setSelectableElements3D] = useState<
    SelectableElement[]
  >([]);
  const value = useMemo<CanvasContextProps>(
    () => ({
      selectableElements2D,
      selectableElements3D,
      setSelectableElements2D,
      setSelectableElements3D,
      getSelectableElementByPosition2D: (
        position: Position2D,
        blueprint: Blueprint
      ) => {
        for (let selectableElement of selectableElements2D) {
          let ele = blueprint.elements.find(
            (ele) => ele._id === selectableElement.elementId
          );
          if (elementTypes[ele.type].isOverlapped2D(ele, blueprint, position)) {
            return selectableElement;
          }
        }
        return null;
      },
      getSelectableElementByPosition3D: (
        position: Position3D,
        blueprint: Blueprint
      ) => {
        for (let selectableElement of selectableElements3D) {
          let ele = blueprint.elements.find(
            (ele) => ele._id === selectableElement.elementId
          );
          if (elementTypes[ele.type].isOverlapped3D(ele, blueprint, position)) {
            return selectableElement;
          }
        }
        return null;
      },
    }),
    [selectableElements2D, selectableElements3D]
  );

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};

export default {
  ...CanvasContext,
  Provider,
  Consumer: CanvasContext.Consumer,
};
