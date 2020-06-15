import Form from "./Form";
import { ElementType } from "../../typings";
import { ObjectID } from "bson";
import Actions from "./Actions";

export interface WallProperties {
  elements: string[];
}

export default {
  key: "wall",
  name: "Wall",
  categories: ["wall"],
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
      corners: [
        // TODO: add corners
      ],
    };
  },
  form: Form,
  actions: Actions,
} as ElementType<WallProperties>;
