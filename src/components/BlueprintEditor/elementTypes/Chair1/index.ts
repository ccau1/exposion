import { ElementType } from "../../typings";

export interface FurnitureProperties {
  elements: string[];
}

export default {
  inherits: "furniture",
  key: "chair1",
  name: "Chair 1",
  menuHidden: false,
} as ElementType<FurnitureProperties>;
