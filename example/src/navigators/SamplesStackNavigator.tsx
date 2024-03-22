import React from "react";
import SamplesScreen from "../screens/SamplesScreen";
import SampleFullFeaturedScreen from "../screens/SampleFullFeaturedScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SampleMinimalScreen from "../screens/SampleMinimalScreen";

const Stack = createNativeStackNavigator();
export default function SamplesStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SampleOverview"
      screenOptions={
        {
          detachInactiveScreens: true,
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: '#FFC50F',
        }}>
      <Stack.Screen name="SampleOverview" component={SamplesScreen} options={{ title: 'Samples' }} />
      <Stack.Screen name="Sample_FullFeatured" component={SampleFullFeaturedScreen} options={{ title: 'Full Featured' }} />
      <Stack.Screen name="Sample_Minimal" component={SampleMinimalScreen} options={{ title: 'Minimal' }} />
    </Stack.Navigator>
  );
}
