import React from "react";
import OverviewScreen from "../screens/OverviewScreen";
import SampleExtendedScreen from "../screens/SampleExtendedScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SampleMinimalScreen from "../screens/SampleMinimalScreen";

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
    </Stack.Navigator>
  );
}

