import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ConfigScreen from "../screens/ConfigScreen";
import SamplesStackNavigator from "./SamplesStackNavigator";

const Tab = createBottomTabNavigator();
export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Samples"
      screenOptions={
        {
          headerShown: false,
          headerTitleAlign: "center",
          headerTintColor: '#FFC50F',
        }}>
      <Tab.Screen name="Samples"
                  component={SamplesStackNavigator} />
      <Tab.Screen name="Config"
                  component={ConfigScreen} />
    </Tab.Navigator>
  );
}
