import React, {
  createContext,
  CElement,
  useContext,
  useMemo,
  useState,
} from "react";
import elementTypes from "../elementTypes";
import { Blueprint, BlueprintElement } from "../typings";
import { CanvasContext } from "./CanvasContext";

export interface BlueprintContextProps {
  blueprint: Blueprint;
  onBlueprintChange: (blueprint: Blueprint, description?: string) => void;
  addBlueprintChangeListener: (fn: BlueprintChangeListenerFunction) => void;
  removeBlueprintChangeListener: (fn: BlueprintChangeListenerFunction) => void;
  updateElementById: (elementId: string, element: BlueprintElement) => void;
  addElement: (type: string, fields?: { [key: string]: any }) => void;
  moveElementDelta: (
    element: BlueprintElement | string,
    deltaX: number,
    deltaY: number,
    deltaZ?: number
  ) => void;
  moveElementTo: (
    element: BlueprintElement | string,
    x: number,
    y: number,
    z?: number
  ) => void;
  getElementById: (elementId: string) => BlueprintElement;
  getElementByPosition: (
    x: number,
    y: number,
    z?: number
  ) => BlueprintElement | null;
}

type BlueprintChangeListenerFunction = (
  newBlueprint: Blueprint,
  oldBlueprint: Blueprint,
  description: string
) => void;

interface BlueprintProviderProps {
  blueprint: Blueprint;
  children?: CElement<any, any>;
  onBlueprintChange?: (blueprint: Blueprint) => void;
}

export const BlueprintContext = createContext<BlueprintContextProps>(null);

const Provider = ({
  blueprint,
  onBlueprintChange,
  children,
}: BlueprintProviderProps) => {
  // const { mousePosition } = useContext(TouchTrackerContext);
  const { getSelectableElementByPosition } = useContext(CanvasContext);
  const [blueprintChangeListeners, setBlueprintChangeListeners] = useState<
    BlueprintChangeListenerFunction[]
  >([]);

  const value = useMemo(
    () => ({
      blueprint,
      onBlueprintChange(newBlueprint: Blueprint, description: string = "") {
        blueprintChangeListeners.forEach((listenerFn) =>
          listenerFn(newBlueprint, blueprint, description)
        );
        onBlueprintChange(newBlueprint);
      },
      addBlueprintChangeListener(fn: BlueprintChangeListenerFunction) {
        setBlueprintChangeListeners([...blueprintChangeListeners, fn]);
      },
      removeBlueprintChangeListener(fn: BlueprintChangeListenerFunction) {
        setBlueprintChangeListeners(
          blueprintChangeListeners.filter((l) => l !== fn)
        );
      },
      // method: update the element by id
      updateElementById(elementId: string, element: BlueprintElement) {
        // TODO
      },
      // method: add new element to blueprint
      addElement(type: string, fields: { [key: string]: any }) {
        // when add element, call the element type's new method
        const { elements, corners } = elementTypes[type].new(fields);
        const newBlueprint = {
          ...blueprint,
          elements: [...blueprint.elements, ...elements],
          corners: [...blueprint.corners, ...corners],
        };

        // update whole blueprint
        value.onBlueprintChange(newBlueprint);
      },
      removeElements(elementIds: string[]) {
        let newBlueprint = { ...value.blueprint };
        newBlueprint.elements = newBlueprint.elements.reduce(
          (elements, ele) => {
            if (elementIds.includes(ele._id)) {
              // this element is marked for remove

              // remove corners linked to this element
              // FIXME: shared corners between walls?
              if (ele.corners?.length) {
                newBlueprint.corners = newBlueprint.corners.filter(
                  (c) => !ele.corners.includes(c._id)
                );
              }

              // call element type's custom remove function
              // FIXME: what if it updates other elements? This reduce will
              // replace newBlueprint.elements
              newBlueprint = elementTypes[ele.type].remove?.(newBlueprint, ele);
            } else {
              // element not marked for remove, add it
              elements.push(ele);
            }
            return elements;
          },
          []
        );

        // TODO: update blueprint state if required (ie selected deleted item?)

        // update blueprint
        value.onBlueprintChange({
          ...value.blueprint,
          corners: value.blueprint.corners,
        });
      },
      // method: return the element by id
      getElementById(elementId: string) {
        return value.blueprint.elements.find((e) => e._id === elementId);
      },
      getElementsByIds(elementIds: string[]) {
        return value.blueprint.elements.filter((e) =>
          elementIds.includes(e._id)
        );
      },
      // method: return the element index by id
      getElementIndexById(elementId: string) {
        return value.blueprint.elements.findIndex((e) => e._id === elementId);
      },
      // method: get element by position
      getElementByPosition(x: number, y: number, z?: number) {
        const selectableElement = getSelectableElementByPosition({ x, y, z });
        // if no selectableElement found, return null
        if (!selectableElement) return null;
        return value.getElementById(selectableElement.elementId);
      },
      // method: move element based on delta position change
      moveElementDelta(
        elementId: BlueprintElement | string,
        deltaX: number,
        deltaY: number,
        deltaZ?: number
      ) {
        // get current list of elements
        let blueprint = value.blueprint;
        // declare element variable
        let element: BlueprintElement;
        // if element param is a string
        if (typeof elementId === "string") {
          // get element object by id
          element = value.getElementById(elementId);
        } else {
          // else, assume param is element itself, assign it
          element = elementId;
        }
        // if element has function, call its move method first
        if (elementTypes[element.type].moveDelta) {
          blueprint = elementTypes[element.type].moveDelta(
            blueprint,
            element,
            deltaX,
            deltaY,
            deltaZ
          );
        }
        // define new center for this element
        const newCenter = {
          x: (element.center.x || 0) + deltaX,
          y: (element.center.y || 0) + deltaY,
          z: (element.center.z || 0) + deltaZ,
        };

        // FIXME: danger! mutating original element!
        element.center = newCenter;
        // call onBlueprintChange with new element in the blueprint
        value.onBlueprintChange(blueprint);
      },
      // move element to a new position
      moveElementTo(
        elementId: BlueprintElement | string,
        x: number,
        y: number,
        z?: number
      ) {
        // declare element variable
        let element: BlueprintElement;
        // if incoming elementId is a string, get element by id
        if (typeof elementId === "string") {
          element = value.getElementById(elementId);
        } else {
          // if incoming elementId not string, assume it is already element
          element = elementId;
        }
        // call move delta based on change to element
        value.moveElementDelta(
          element,
          x - (element.center[0] || 0),
          y - (element.center[1] || 0),
          z - (element.center[2] || 0)
        );
      },
    }),
    [
      blueprint,
      getSelectableElementByPosition,
      onBlueprintChange,
      blueprintChangeListeners,
    ]
  );

  return (
    <BlueprintContext.Provider value={value}>
      {children}
    </BlueprintContext.Provider>
  );
};

export default {
  ...BlueprintContext,
  Provider,
  Consumer: BlueprintContext.Consumer,
};
