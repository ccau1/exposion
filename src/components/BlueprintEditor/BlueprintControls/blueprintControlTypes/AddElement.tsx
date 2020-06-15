import React, { useContext, useState, useMemo } from "react";
import {
  BlueprintControlType,
  BlueprintControlTypeRenderProps,
  BlueprintControlTypeToolbarProps,
} from "../../typings";
import elementTypes from "../../elementTypes";
import styles from "../../styles";
import { BlueprintContext } from "../../contexts/BlueprintContext";
import Button from "../../components/Button";
import Tabs from "../../components/Tabs";
import TextInput from "../../components/TextInput";
import { Image, View } from "react-native";

const Render = ({ orientation }: BlueprintControlTypeRenderProps) => {
  const { addElement } = useContext(BlueprintContext);
  const categories = useMemo(
    () => [
      ...new Set(
        Object.values(elementTypes || {}).reduce(
          (accArr, elementType) => accArr.concat(elementType.categories),
          []
        )
      ),
    ],
    []
  );
  const [selectedCategoryView, setSelectedCategoryView] = useState<string>(
    categories?.[0] || ""
  );

  return (
    <View style={{ display: "flex", flexDirection: "row", flex: 1 }}>
      {orientation === "horizontal" && (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* {categories.map((cat) => (
            <Button
              key={cat}
              onPress={() => setSelectedCategoryView(cat)}
              style={styles.elementTypeButton}
            >
              {cat}
            </Button>
          ))} */}

          <Tabs
            items={categories.map((c) => ({ value: c, text: c }))}
            selected={selectedCategoryView}
            onSelect={setSelectedCategoryView}
          />
        </View>
      )}
      <View style={{ overflowY: "auto", flex: 1 }}>
        {orientation === "vertical" && (
          <Tabs
            items={categories.map((c) => ({ value: c, text: c }))}
            selected={selectedCategoryView}
            onSelect={setSelectedCategoryView}
            horizontal
          />
        )}
        {Object.values(elementTypes || {}).map((elementType) =>
          !elementType.menuHidden &&
          elementType.categories.includes(selectedCategoryView) ? (
            <Button
              key={elementType.key}
              style={styles.elementTypeButton}
              onPress={() => addElement(elementType.key)}
            >
              {elementType.name}
            </Button>
          ) : null
        )}
      </View>
    </View>
  );
};

const Toolbar = ({ controlType }: BlueprintControlTypeToolbarProps) => {
  return (
    <React.Fragment>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: "/blueprintEditor/icon_furniture@3x.png" }}
            style={{ width: "30px", height: "30px" }}
          />
          <p style={{ marginLeft: "10px" }}>{controlType.name}</p>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput placeholder={"Search Keywords"} />
        </View>
      </View>
    </React.Fragment>
  );
};

export default {
  key: "addElement",
  name: "Add Element",
  icon: "/blueprintEditor/icon_addElement@3x.png",
  iconActive: "/blueprintEditor/icon_addElement_active@3x.png",
  toolbar: Toolbar,
  render: Render,
} as BlueprintControlType;
