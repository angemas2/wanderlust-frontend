import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import ExploreScreen from "./screens/ExploreScreen";
import InspirationScreen from "./screens/InspirationScreen";
import MyTripsScreen from "./screens/MyTripsScreen";
import NavScreen from "./screens/NavScreen";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = "";

          if (route.name === "Mytrips") {
            iconName = "map";
          } else if (route.name === "Explore") {
            iconName = "map";
          } else if (route.name === "Inspiration") {
            iconName = "lightbulb-o";
          } else if (route.name === "Nav") {
            iconName = "compass";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FFB703",
        tabBarInactiveTintColor: "#023047",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Mytrips" component={MyTripsScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Inspiration" component={InspirationScreen} />
      <Tab.Screen name="Nav" component={NavScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={LoginScreen} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
