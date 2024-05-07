import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import SamplesStackNavigator from './navigators/SamplesStackNavigator';
import { Platform } from 'react-native';
import { SampleExtendedScreen } from './screens';
import { linking, navTheme } from './navigators/NavigationConfig';

export default function App() {
  const singleScreen = false || Platform.isTV;

  return (
    <NavigationContainer linking={linking} theme={navTheme}>
      {!singleScreen && <SamplesStackNavigator />}
      {singleScreen && <SampleExtendedScreen />}
    </NavigationContainer>
  );
}
