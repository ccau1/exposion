import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { ElementFormProps } from "../../typings";
import { WallProperties } from ".";

export default ({ element }: ElementFormProps<WallProperties>) => {
  return (
    <div>
      wall form
      <SyntaxHighlighter language="javascript">
        {JSON.stringify(element, null, 2)}
      </SyntaxHighlighter>
      {/* wall form _id: {elementForm.element._id}
      <br />
      type: {elementForm.element.type}
      <br />
      parent: {elementForm.element.parent}
      <br />
      center: {JSON.stringify(elementForm.element.center)}
      <br />
      corners: {JSON.stringify(elementForm.element.corners)}
      <br />
      rotate: {JSON.stringify(elementForm.element.rotate)}
      <br />
      isInWall: {elementForm.element.isInWall}
      <br />
      properties: {JSON.stringify(elementForm.element.properties)} */}
    </div>
  );
};
