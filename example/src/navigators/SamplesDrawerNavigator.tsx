import React from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
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

const Drawer = createDrawerNavigator();
export default function SamplesDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="SampleOverview"
      screenOptions={
        {
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: '#FFC50F',
        }}>
      <Drawer.Screen name="SampleOverview"
                    component={OverviewScreen}
                    options={{ title: 'Sample Overview' }} />
      <Drawer.Screen name="Sample_Extended"
                    component={SampleExtendedScreen}
                    options={{ title: 'Extended Setup' }} />
      <Drawer.Screen name="Sample_Minimal"
                    component={SampleMinimalScreen}
                    options={{ title: 'Minimal Setup' }} />
      <Drawer.Screen name="Sample_PresentationModes"
                    component={SamplePresentationModesScreen}
                    options={{ title: 'PresentationModes' }} />
      <Drawer.Screen name="Sample_DRM"
                    component={SampleDRMScreen}
                    options={{ title: 'DRM' }} />
      <Drawer.Screen name="Sample_SideloadedTextTrack"
                    component={SampleSideloadedTextTrackScreen}
                    options={{ title: 'Sideloaded TextTrack' }} />
      <Drawer.Screen name="Sample_Conviva"
                    component={SampleAnalyticsConvivaScreen}
                    options={{ title: 'Analytics: Conviva' }} />
      <Drawer.Screen name="Sample_Comscore"
                    component={SampleAnalyticsComscoreScreen}
                    options={{ title: 'Analytics: Comscore' }} />
      <Drawer.Screen name="Sample_Nielsen"
                    component={SampleAnalyticsNielsenScreen}
                    options={{ title: 'Analytics: Nielsen' }} />
      <Drawer.Screen name="Sample_Adobe"
                    component={SampleAnalyticsAdobeScreen}
                    options={{ title: 'Analytics: Adobe' }} />
    </Drawer.Navigator>
  );
}

