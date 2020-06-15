import React, {
  createContext,
  CElement,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import * as jsondiffpatch from "jsondiffpatch";
import { BlueprintContext } from "./BlueprintContext";
import { Blueprint } from "../typings";

interface BlueprintHistory {
  description: string;
  delta: any;
}

export interface BlueprintHistoryContextProps {
  history: BlueprintHistory[];
  historyIndex: number;
  push: (
    oldBlueprint: Blueprint,
    newBlueprint: Blueprint,
    description: string
  ) => void;
  setHistoryIndex: (index: number) => void;
  undo: () => void;
  redo: () => void;
  isUndoEnd: () => boolean;
  isRedoEnd: () => boolean;
}

export interface BlueprintHistoryProviderProps {
  onBlueprintChange?: (newBlueprint: Blueprint) => void;
  children?: CElement<any, any>;
}

export const BlueprintHistoryContext = createContext<
  BlueprintHistoryContextProps
>(null);

const Provider = ({
  onBlueprintChange,
  children,
}: BlueprintHistoryProviderProps) => {
  const [history, setHistory] = useState<BlueprintHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const {
    blueprint,
    addBlueprintChangeListener,
    removeBlueprintChangeListener,
  } = useContext(BlueprintContext);

  // console.log("outside history", history);
  const value = useMemo(
    () => ({
      history,
      historyIndex,
      push: (oldObj, newObj, description: string = "") => {
        const delta = jsondiffpatch.diff(oldObj, newObj);
        // remove anything after the current index. If undo or jumped to a
        // point in history and we're adding new record, all redo items will
        // be removed.
        // Add delta to the sliced list
        console.log(
          "value.push",
          value.history,
          history,
          historyIndex,
          history.slice(0, historyIndex + 1)
        );

        const newHistory = [
          ...history.slice(0, historyIndex + 1),
          { description, delta },
        ];
        // console.log("value.push newHistory", newHistory);

        // get latest position as our index
        const newHistoryIndex = newHistory.length - 1;
        // store our new history list and index
        setHistory(newHistory);
        setHistoryIndex(newHistoryIndex);
      },
      setHistoryIndex(index: number) {
        if (index < -1 || index > value.history.length - 1) {
          throw new Error("cannot set out of bound index to history");
        }
        let curBlueprint = blueprint;
        let i = historyIndex;
        while (i !== index) {
          if (i < index) {
            // if i is less than index, add one to i
            i++;
            // call patch to current blueprint
            jsondiffpatch.unpatch(curBlueprint, value.history[i].delta);
          } else {
            // call reverse to current blueprint
            jsondiffpatch.patch(curBlueprint, value.history[i].delta);
            // if i is more than index, minus one to i
            i--;
          }
        }
        // update blueprint to this
        onBlueprintChange(curBlueprint);
        // to jump to a specific index
        setHistoryIndex(index);
      },
      undo() {
        if (historyIndex < 0 || !history.length) return;
        // if index not 0, set current index minus one,
        // else just set to 0
        value.setHistoryIndex(historyIndex - 1);
      },
      redo() {
        // if historyIndex already at the end or history list empty,
        // end function
        if (historyIndex >= history.length - 1 || !history.length) return;
        // if index not last item, add one
        // else set to last index
        value.setHistoryIndex(historyIndex + 1);
      },
      isUndoEnd() {
        return historyIndex < 0;
      },
      isRedoEnd() {
        return historyIndex >= history.length - 1;
      },
    }),
    [blueprint, history, historyIndex, onBlueprintChange]
  );

  const blueprintChangeListener = useCallback(
    (newBlueprint, oldBlueprint, description) => {
      value.push(newBlueprint, oldBlueprint, description);
    },
    [value]
  );

  useEffect(() => {
    removeBlueprintChangeListener(blueprintChangeListener);
    addBlueprintChangeListener(blueprintChangeListener);
    return () => removeBlueprintChangeListener(blueprintChangeListener);
  }, [blueprintChangeListener]);

  return (
    <BlueprintHistoryContext.Provider value={value}>
      {children}
    </BlueprintHistoryContext.Provider>
  );
};

export default {
  ...BlueprintHistoryContext,
  Provider,
  Consumer: BlueprintHistoryContext.Consumer,
};
