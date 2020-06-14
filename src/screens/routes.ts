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
              url: "/",
              auth: [],
            },
            {
              name: "Home1",
              component: "HomeScreen",
              url: "/",
              auth: [],
            },
          ],
        },
        url: "/",
      },
      {
        name: "BlueprintEditor",
        component: "BlueprintEditorScreen",
        url: "/blueprints/:_id",
        auth: [],
      },
      {
        name: "Settings",
        component: "SettingsScreen",
        url: "/settings",
        auth: [],
      },
    ],
  },
];

export const getRouteUrls = (routes: Routes): LinkConfig => {
  return routes.reduce<LinkConfig>((urls, route) => {
    route.screens?.forEach((screen) => {
      if (screen.url) {
        urls[screen.name] = screen.url;
      }
      if (screen.navigator) {
        urls = { ...urls, ...getRouteUrls([screen.navigator]) };
      }
    });
    return urls;
  }, {});
};

export default routes;
