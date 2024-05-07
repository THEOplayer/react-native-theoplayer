import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  OverviewScreen,
  SampleMinimalScreen,
  SampleExtendedScreen,
  SamplePresentationModesScreen,
  SampleDRMScreen,
  SampleSideloadedTextTrackScreen,
  SampleAnalyticsConvivaScreen,
  SampleAnalyticsComscoreScreen,
  SampleAnalyticsNielsenScreen,
  SampleAnalyticsAdobeScreen,
} from '../screens';

const Stack = createStackNavigator();
export default function SamplesStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SampleOverview"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTintColor: '#FFC50F',
      }}>
      <Stack.Screen name="SampleOverview" component={OverviewScreen} options={{ title: 'Sample Overview' }} />
      <Stack.Screen name="Sample_Extended" component={SampleExtendedScreen} options={{ title: 'Extended Setup' }} />
      <Stack.Screen name="Sample_Minimal" component={SampleMinimalScreen} options={{ title: 'Minimal Setup' }} />
      <Stack.Screen name="Sample_PresentationModes" component={SamplePresentationModesScreen} options={{ title: 'PresentationModes' }} />
      <Stack.Screen name="Sample_DRM" component={SampleDRMScreen} options={{ title: 'DRM' }} />
      <Stack.Screen name="Sample_SideloadedTextTrack" component={SampleSideloadedTextTrackScreen} options={{ title: 'Sideloaded TextTrack' }} />
      <Stack.Screen name="Sample_Conviva" component={SampleAnalyticsConvivaScreen} options={{ title: 'Analytics: Conviva' }} />
      <Stack.Screen name="Sample_Comscore" component={SampleAnalyticsComscoreScreen} options={{ title: 'Analytics: Comscore' }} />
      <Stack.Screen name="Sample_Nielsen" component={SampleAnalyticsNielsenScreen} options={{ title: 'Analytics: Nielsen' }} />
      <Stack.Screen name="Sample_Adobe" component={SampleAnalyticsAdobeScreen} options={{ title: 'Analytics: Adobe' }} />
    </Stack.Navigator>
  );
}
