import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ExploreScreen from './screens/ExploreScreen';
import InspirationScreen from './screens/InspirationScreen';
import ItineraryDetailsScreen from './screens/ItineraryDetailsScreen';
import MyTripsScreen from './screens/MyTripsScreen';
import NavScreen from './screens/NavScreen';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faMap,
  faMapLocationDot,
  faLightbulb,
  faCompass,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { extendTheme, NativeBaseProvider } from 'native-base';

<<<<<<< HEAD
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import * as Location from "expo-location";
import PositionContext from "./utils/context";
import places from "./reducers/places";
import user from "./reducers/user";
=======
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as Location from 'expo-location';
import PositionContext from './utils/context';
import places from './reducers/places';
>>>>>>> 77df91b1c77e0d894630a282a77f95cbc73fa7a9

import UserProvider, { UserContext } from './utils/logincontext';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: IconDefinition;

          switch (route.name) {
            case 'MyTrips':
              iconName = faMap;
              break;
            case 'Explore':
              iconName = faMapLocationDot;
              break;
            case 'Inspiration':
              iconName = faLightbulb;
              break;
            case 'Nav':
              iconName = faCompass;
              break;
            default:
              iconName = faXmark;
              break;
          }

          return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFB703',
        tabBarInactiveTintColor: '#023047',
        headerShown: false,
      })}>
      <Tab.Screen name="MyTrips" component={MyTripsScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Inspiration" component={InspirationScreen} />
      <Tab.Screen name="Nav" component={NavScreen} />
    </Tab.Navigator>
  );
};

const store = configureStore({
  reducer: { places,user },
});

export default function App() {
  const [positionObj, setPositionObj] = useState({
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    latitude: 0,
    longitude: 0,
    speed: 0,
  });

  const { user, login } = useContext(UserContext);

  //Get user position
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location: any) => {
          setPositionObj(location.coords);
        });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem('WANDERLUST::AUTHSTATE_USERNAME');
      if (value !== '') {
        console.log(value);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem('WANDERLUST::AUTHSTATE_USERNAME', `${user.username}`);
    })();
  }, [user]);

  return (
    <Provider store={store}>
      <>
        {console.log(user.username)}
        <PositionContext.Provider value={positionObj}>
          <NativeBaseProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user.username === '' ? (
                  <>
                    <Stack.Screen name="Home" component={WelcomeScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="ItineraryDetails" component={ItineraryDetailsScreen} />
                    <Stack.Screen name="TabNavigator" component={TabNavigator} />
                  </>
                ) : (
                  <>
                    <Stack.Screen name="Home" component={WelcomeScreen} />
                    <Stack.Screen name="ItineraryDetails" component={ItineraryDetailsScreen} />
                    <Stack.Screen name="TabNavigator" component={TabNavigator} />
                  </>
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </NativeBaseProvider>
        </PositionContext.Provider>
      </>
    </Provider>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 300,
  },
});
