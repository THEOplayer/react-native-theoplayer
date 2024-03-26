import * as React from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import BottomTabNavigator from "./navigators/BottomTabNavigator";
import {Platform} from "react-native";
import SampleExtendedScreen from "./screens/SampleExtendedScreen";

export default function App() {

  const navTheme = {
    ...DarkTheme,
    dark: true,
    colors: {
      ...DarkTheme.colors,
      primary: "#FFC50F",
    },
  };

  const singleScreen = Platform.isTV || Platform.OS === 'web';

  return (
    <NavigationContainer theme={navTheme}>
      {!singleScreen && (<BottomTabNavigator/>)}
      {singleScreen && (<SampleExtendedScreen/>)}
    </NavigationContainer>
  );
}
