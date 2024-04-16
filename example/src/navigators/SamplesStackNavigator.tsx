import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
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
  SampleAnalyticsAdobeScreen
} from "../screens";

const Stack = createNativeStackNavigator();
export default function SamplesStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SampleOverview"
      screenOptions={
        {
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: '#FFC50F',
        }}>
      <Stack.Screen name="SampleOverview"
                    component={OverviewScreen}
                    options={{ title: 'Sample Overview' }} />
      <Stack.Screen name="Sample_Extended"
                    component={SampleExtendedScreen}
                    options={{ title: 'Extended Setup' }} />
      <Stack.Screen name="Sample_Minimal"
                    component={SampleMinimalScreen}
                    options={{ title: 'Minimal Setup' }} />
      <Stack.Screen name="Sample_PresentationModes"
                    component={SamplePresentationModesScreen}
                    options={{ title: 'PresentationModes Setup' }} />
      <Stack.Screen name="Sample_DRM"
                    component={SampleDRMScreen}
                    options={{ title: 'DRM Setup' }} />
      <Stack.Screen name="Sample_SideloadedTextTrack"
                    component={SampleSideloadedTextTrackScreen}
                    options={{ title: 'Sideloaded TextTrack Setup' }} />
      <Stack.Screen name="Sample_Conviva"
                    component={SampleAnalyticsConvivaScreen}
                    options={{ title: 'Analytics Setup: Conviva' }} />
      <Stack.Screen name="Sample_Comscore"
                    component={SampleAnalyticsComscoreScreen}
                    options={{ title: 'Analytics Setup: Comscore' }} />
      <Stack.Screen name="Sample_Nielsen"
                    component={SampleAnalyticsNielsenScreen}
                    options={{ title: 'Analytics Setup: Nielsen' }} />
      <Stack.Screen name="Sample_Adobe"
                    component={SampleAnalyticsAdobeScreen}
                    options={{ title: 'Analytics Setup: Adobe' }} />
    </Stack.Navigator>
  );
}

