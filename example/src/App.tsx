import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import SamplesStackNavigator from './navigators/SamplesStackNavigator';
import { Platform } from 'react-native';
import { SampleExtendedScreen } from './screens';

export default function App() {
  const navTheme = {
    ...DarkTheme,
    dark: true,
    colors: {
      ...DarkTheme.colors,
      primary: '#FFC50F',
    },
  };

  const singleScreen = Platform.isTV;

  return (
    <NavigationContainer theme={navTheme}>
      {!singleScreen && <SamplesStackNavigator />}
      {singleScreen && <SampleExtendedScreen />}
    </NavigationContainer>
  );
}
