import React from "react";
import { useContext } from "react";
import { BlueprintStateContext } from "../contexts/BlueprintStateContext";
import elementTypes from "../elementTypes";
import { BlueprintContext } from "../contexts/BlueprintContext";

interface MultipleSelectedActionsProps {
  elementIds: string[];
}

const MultipleSelectedActions = ({ elementIds = [] }) => {
  return <div>You have {elementIds.length} items selected</div>;
};

interface SingleSelectedActionsProps {
  elementId: string;
}

const SingleSelectedActions = ({ elementId }: SingleSelectedActionsProps) => {
  const { state, onStateChange } = useContext(BlueprintStateContext);
  const { getElementById, updateElementById } = useContext(BlueprintContext);
  // if not multiple, just get the element, get its form and display it
  const element = getElementById(elementId);
  // if can't find element, just show empty
  if (!element) return null;
  // get form by element key
  const Actions = elementTypes[element.type].actions;
  // if no form defined, just show empty
  if (!Actions) return null;
  return (
    <div>
      <Actions
        element={element}
        onElementChange={(element) => {
          updateElementById(elementId, element);
        }}
        state={state}
        onStateChange={onStateChange}
      />
    </div>
  );
};

export default () => {
  const { state } = useContext(BlueprintStateContext);
  // if no element(s) selected, just return empty statement
  if (!state?.selected?.elements?.length) {
    return <p>select an element</p>;
  }
  // define variable for elements
  const selectedElements = state.selected.elements;
  // check whether multiple elements are selected
  const isSelectedMultiple = selectedElements.length > 1;

  return isSelectedMultiple ? (
    // if multiple, TODO
    <MultipleSelectedActions elementIds={selectedElements} />
  ) : (
    // if single, call single selected
    <SingleSelectedActions elementId={selectedElements[0]} />
  );
};
