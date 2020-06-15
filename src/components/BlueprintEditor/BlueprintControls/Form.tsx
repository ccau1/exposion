import React from "react";
import { useContext } from "react";
import { BlueprintStateContext } from "../contexts/BlueprintStateContext";
import elementTypes from "../elementTypes";
import { BlueprintContext } from "../contexts/BlueprintContext";

interface MultipleSelectedFormProps {
  elementIds: string[];
}

const MultipleSelectedForm = ({ elementIds }) => {
  return null;
};

interface SingleSelectedFormProps {
  elementId: string;
}

const SingleSelectedForm = ({ elementId }: SingleSelectedFormProps) => {
  const { state, onStateChange } = useContext(BlueprintStateContext);
  const { getElementById, updateElementById } = useContext(BlueprintContext);
  // if not multiple, just get the element, get its form and display it
  const element = getElementById(elementId);
  // if can't find element, just show empty
  if (!element) return null;
  // get form by element key
  const Form = elementTypes[element.type].form;
  // if no form defined, just show empty
  if (!Form) return null;
  return (
    <div>
      <Form
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
    <MultipleSelectedForm elementIds={selectedElements} />
  ) : (
    // if single, call single selected
    <SingleSelectedForm elementId={selectedElements[0]} />
  );
};
