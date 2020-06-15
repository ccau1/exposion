import Form from "./Form";
import {
  ElementType,
  BlueprintElement,
  BlueprintState,
  Blueprint,
} from "../../typings";
import { ObjectID } from "bson";

export interface GroupProperties {
  elements: string[];
}

export default {
  key: "group",
  name: "Group",
  new(ele) {
    return {
      elements: [
        {
          _id: new ObjectID().toString(),
          type: this.key,
          parent: null,
          center: { x: 0, y: 0, z: 0 },
          rotate: { x: 0, y: 0 },
          corners: [],
          properties: {},
          isInWall: false,
          ...ele,
        },
      ],
      corners: [],
    };
  },
  move: () => {},
  form: Form,
  render2D: (
    canvasContext,
    element: BlueprintElement,
    blueprint: Blueprint,
    blueprintState: BlueprintState
  ) => {},
  render3D: (
    canvasContext,
    element: BlueprintElement,
    blueprint: Blueprint,
    blueprintState: BlueprintState
  ) => {},
  categories: [],
  getSelectableElements2D() {
    return [];
  },
  getSelectableElements3D() {
    return [];
  },
} as ElementType<GroupProperties>;
