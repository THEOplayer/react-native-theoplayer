import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  OverviewScreen,
  SampleMinimalScreen,
  SampleExtendedScreen,
  SamplePresentationModesScreen,
  SampleDRMScreen,
  SampleSideloadedTextTrackScreen,
  SampleFlashlistScreen,
  SampleAnalyticsConvivaScreen,
  SampleAnalyticsComscoreScreen,
  SampleAnalyticsNielsenScreen,
  SampleAnalyticsAdobeScreen,
  SampleAnalyticsMuxScreen,
} from '../screens';
import { Platform } from 'react-native';

export type SampleFlashlistParamList = {
  reelMode: boolean;
};

export type RootStackParamList = {
  SampleOverview: undefined;
  SampleExtended: undefined;
  SampleMinimal: undefined;
  SamplePresentationModes: undefined;
  SampleDRM: undefined;
  SampleSideloadedTextTrack: undefined;
  SampleFlashlist: SampleFlashlistParamList;
  SampleConviva: undefined;
  SampleComscore: undefined;
  SampleNielsen: undefined;
  SampleAdobe: undefined;
  SampleMux: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
export default function SamplesStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SampleOverview"
      screenOptions={{
        headerShown: Platform.OS !== 'web',
        headerTitleAlign: 'center',
        headerTintColor: '#FFC50F',
      }}>
      <Stack.Screen name="SampleOverview" component={OverviewScreen} options={{ title: 'Sample Overview' }} />
      <Stack.Screen name="SampleExtended" component={SampleExtendedScreen} options={{ title: 'Extended Setup' }} />
      <Stack.Screen name="SampleMinimal" component={SampleMinimalScreen} options={{ title: 'Minimal Setup' }} />
      <Stack.Screen name="SamplePresentationModes" component={SamplePresentationModesScreen} options={{ title: 'PresentationModes' }} />
      <Stack.Screen name="SampleDRM" component={SampleDRMScreen} options={{ title: 'DRM' }} />
      <Stack.Screen name="SampleSideloadedTextTrack" component={SampleSideloadedTextTrackScreen} options={{ title: 'Sideloaded TextTrack' }} />
      <Stack.Screen name="SampleFlashlist" component={SampleFlashlistScreen} options={{ title: 'Flashlist' }} />
      <Stack.Screen name="SampleConviva" component={SampleAnalyticsConvivaScreen} options={{ title: 'Analytics: Conviva' }} />
      <Stack.Screen name="SampleComscore" component={SampleAnalyticsComscoreScreen} options={{ title: 'Analytics: Comscore' }} />
      <Stack.Screen name="SampleNielsen" component={SampleAnalyticsNielsenScreen} options={{ title: 'Analytics: Nielsen' }} />
      <Stack.Screen name="SampleAdobe" component={SampleAnalyticsAdobeScreen} options={{ title: 'Analytics: Adobe' }} />
      <Stack.Screen name="SampleMux" component={SampleAnalyticsMuxScreen} options={{ title: 'Analytics: Mux' }} />
    </Stack.Navigator>
  );
}
