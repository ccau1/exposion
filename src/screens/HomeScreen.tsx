import React from "react";
import { View, Text, Button } from "react-native";

const HomeScreen = ({ navigation }) => {
  console.log("navigation", navigation);

  return (
    <View>
      <Text>home screen</Text>
      <Button title="Toggle Drawer" onPress={() => navigation.toggleDrawer()} />
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate("Settings")}
      />
    </View>
  );
};

HomeScreen.navigationOptions = () => {
  return {
    renderLeft: () => <Text>abc</Text>,
  };
};

export default HomeScreen;
