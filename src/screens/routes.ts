import { Routes, LinkConfig } from "./typings";

const routes: Routes = [
  {
    initialRouteName: "Home",
    type: "stack",
    screens: [
      {
        name: "HomeDrawer",
        // component: "HomeScreen",
        navigator: {
          type: "drawer",
          initialRouteName: "Home",
          screens: [
            {
              name: "Home",
              component: "HomeScreen",
              path: "/",
              auth: [],
            },
            {
              name: "Home1",
              component: "HomeScreen",
              path: "/",
              auth: [],
            },
          ],
        },
        path: "/",
      },
      {
        name: "BlueprintEditor",
        component: "BlueprintEditorScreen",
        path: "/blueprints/:_id",
        auth: [],
      },
      {
        name: "Settings",
        component: "SettingsScreen",
        path: "/settings",
        auth: [],
      },
    ],
  },
];

export const getRouteUrls = (routes: Routes): LinkConfig => {
  return routes.reduce<LinkConfig>((urls, route) => {
    route.screens?.forEach((screen) => {
      if (screen.path) {
        urls[screen.name] = screen.path;
      }
      if (screen.navigator) {
        urls = { ...urls, ...getRouteUrls([screen.navigator]) };
      }
    });
    return urls;
  }, {});
};

export default routes;
