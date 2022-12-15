import React from "react";
import { useEffect, useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ExploreScreen from "./screens/ExploreScreen";
import InspirationScreen from "./screens/InspirationScreen";
import MyTripsScreen from "./screens/MyTripsScreen";
import NavScreen from "./screens/NavScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMap,
  faMapLocationDot,
  faLightbulb,
  faCompass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { extendTheme, NativeBaseProvider } from "native-base";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as Location from "expo-location";
import PositionContext from "./utils/context";
import places from './reducers/places'

import UserProvider, { UserContext } from "./utils/logincontext";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: IconDefinition;

          switch (route.name) {
            case "MyTrips":
              iconName = faMap;
              break;
            case "Explore":
              iconName = faMapLocationDot;
              break;
            case "Inspiration":
              iconName = faLightbulb;
              break;
            case "Nav":
              iconName = faCompass;
              break;
            default:
              iconName = faXmark;
              break;
          }

          return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FFB703",
        tabBarInactiveTintColor: "#023047",
        headerShown: false,
      })}
    >
      <Tab.Screen name="MyTrips" component={MyTripsScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Inspiration" component={InspirationScreen} />
      <Tab.Screen name="Nav" component={NavScreen} />
    </Tab.Navigator>
  );
};


const store = configureStore({
  reducer: { places },
});


export default function App() {

  const [positionObj, setPositionObj] = useState({});

  const { user, login } = useContext(UserContext);

  //Get user position
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        Location.watchPositionAsync(
          { distanceInterval: 10 },
          (location: any) => {
            setPositionObj(location.coords);
          }
        );
      }
    })();
  }, []);



  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem(
        "WANDERLUST::AUTHSTATE_USERNAME"
      );
      if (value !== "") {
        console.log(value);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem(
        "WANDERLUST::AUTHSTATE_USERNAME",
        `${user.username}`
      );
    })()
  }, [user]);

  return (
    <Provider store={store}>
      <UserProvider>
        <>
          {console.log(user.username)}
          <PositionContext.Provider value={positionObj}>
            <NativeBaseProvider>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  {user.username === "" ? (
                    <>
                      <Stack.Screen name="Home" component={RegisterScreen} />
                      <Stack.Screen name="Login" component={LoginScreen} />
                      <Stack.Screen
                        name="TabNavigator"
                        component={TabNavigator}
                      />
                    </>
                  ) : (
                    <Stack.Screen name="TabNavigator" component={TabNavigator} />
                  )}
                </Stack.Navigator>
              </NavigationContainer>
            </NativeBaseProvider>
          </PositionContext.Provider>
        </>
      </UserProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 300,
  },
});
