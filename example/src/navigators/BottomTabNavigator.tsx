import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ConfigScreen } from "../screens";
import SamplesStackNavigator from "./SamplesStackNavigator";

const Tab = createBottomTabNavigator();
export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Samples"
      screenOptions={
        {
          headerTitleAlign: "center",
          headerTintColor: '#FFC50F',
        }}>
      <Tab.Screen name="Samples"
                  component={SamplesStackNavigator}
                  options={{
                    headerShown: false
                  }} />
      <Tab.Screen name="Config"
                  component={ConfigScreen}
                  options={{
                    headerShown: true
                  }} />
    </Tab.Navigator>
  );
}
