import React, { useContext } from "react";
import { BlueprintControlType } from "../../typings";
import SyntaxHighlighter from "react-syntax-highlighter";
import { BlueprintContext } from "../../contexts/BlueprintContext";
import { BlueprintStateContext } from "../../contexts/BlueprintStateContext";
import View from "../../components/View";

const Render = () => {
  const { blueprint } = useContext(BlueprintContext);
  const { state } = useContext(BlueprintStateContext);
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <View style={{ flex: 1 }}>
        <SyntaxHighlighter language="javascript">
          {"// Blueprint"}
        </SyntaxHighlighter>
        <SyntaxHighlighter language="javascript">
          {JSON.stringify(blueprint, null, 2)}
        </SyntaxHighlighter>
      </View>
      <View style={{ flex: 1 }}>
        <SyntaxHighlighter language="javascript">
          {"// Blueprint State"}
        </SyntaxHighlighter>
        <SyntaxHighlighter language="javascript">
          {JSON.stringify(state, null, 2)}
        </SyntaxHighlighter>
      </View>
    </div>
  );
};

export default {
  key: "code",
  name: "Code",
  icon: "/blueprintEditor/icon_form@3x.png",
  iconActive: "/blueprintEditor/icon_form_active@3x.png",
  render: Render,
} as BlueprintControlType;
