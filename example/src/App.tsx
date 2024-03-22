import * as React from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import BottomTabNavigator from "./navigators/BottomTabNavigator";

export default function App() {

  const navTheme = {
    ...DarkTheme,
    dark: true,
    colors: {
      ...DarkTheme.colors,
      primary: "#FFC50F",
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
