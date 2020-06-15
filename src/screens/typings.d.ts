import { SFC } from "react";

export interface RouteScreen {
  name: string;
  path: string;
  component?: string | SFC;
  navigator?: RouteNavigator;
  auth?: string[];
}

export interface RouteNavigator {
  type: "stack" | "tab" | "drawer";
  initialRouteName: string;
  screens: RouteScreen[];
}

export type Routes = RouteNavigator[];

export interface LinkConfig {
  [screenName: string]: string;
}
