import React from "react";
import routes, { getRouteUrls } from "../../screens/routes";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import screens from "../../screens";
import { NavigationContainer, TypedNavigator } from "@react-navigation/native";
import { RouteScreen, RouteNavigator } from "../../screens/typings";

const renderRouteNavigator = (routeNavigator: RouteNavigator) => {
  let NavigatorType: TypedNavigator<any, any, any, any, any>;
  switch (routeNavigator.type) {
    case "tab":
      NavigatorType = createBottomTabNavigator();
      break;
    case "drawer":
      NavigatorType = createDrawerNavigator();
      break;
    case "stack":
    default:
      NavigatorType = createStackNavigator();
      break;
  }
  const renderRouteScreens = routeNavigator.screens.map(
    (screen: RouteScreen) => {
      if (screen.component) {
        return (
          <NavigatorType.Screen
            key={screen.name}
            name={screen.name}
            component={
              typeof screen.component === "string"
                ? screens[screen.component]
                : screen.component
            }
          />
        );
      } else if (screen.navigator) {
        return (
          <NavigatorType.Screen
            key={screen.name}
            name={screen.name}
            children={() =>
              screen.navigator ? renderRouteNavigator(screen.navigator) : null
            }
          />
        );
      } else {
        return null;
      }
    }
  );

  return React.createElement(NavigatorType.Navigator, {
    initialRouteName: routeNavigator.initialRouteName,
    drawerType: "permanent",
    children: renderRouteScreens,
  });
};

const Routes = () => {
  const routeUrls = getRouteUrls(routes);

  const linking = {
    // TODO: need to fetch from app.json or .env instead
    prefixes: ["https://exposion.com", "exposion://"],
    config: routeUrls,
  };

  return (
    <NavigationContainer linking={linking}>
      {routes.map((route, routeIndex) => {
        return renderRouteNavigator(route);
      })}
    </NavigationContainer>
  );
};

export default Routes;
