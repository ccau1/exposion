import Form from "./Form";
import { ObjectID } from "bson";
import { ElementType } from "../../typings";
import Actions from "./Actions";

export interface FurnitureProperties {
  elements: string[];
}

export default {
  key: "furniture",
  name: "Furniture",
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
  menuHidden: true,
  categories: ["furniture"],
  controls: ["move", "rotate", "scale"],
  form: Form,
  actions: Actions,
} as ElementType<FurnitureProperties>;
