import React, { useEffect, useState, useContext, useCallback } from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addNewLike, getDefaultPlaces } from '../reducers/places';
import Card from './Card';
import PositionContext from '../utils/context';

import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/dev'; //import fonts

function ExploreSwipe() {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCveSLV5eqlnggp-8nsCSh5zrGdTssTkVk';

  //Variable for calling useDispatch
  const dispatch = useDispatch();

  //Get the context define in App.tsx
  const positionContext = useContext(PositionContext);

  //Array of places with all information in a certain perimeter
  const [placesData, setPlacesData] = useState([]);
  const [index, setIndex] = useState(0);

  //Request to get places in a certain perimeter
  useEffect(() => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${positionContext.latitude},${positionContext.longitude}&types=tourist_attraction&radius=5000&sensor=false&key=${GOOGLE_MAPS_APIKEY}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPlacesData(data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //UseEffet listening to update on placesData, just to make sure that places state will not be empty
  useEffect(() => {
    placesData.length > 0
      ? placesData.map((e, i) => {
          let photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&photo_reference=${e.photos[0].photo_reference}&key=${GOOGLE_MAPS_APIKEY}`;
          dispatch(
            getDefaultPlaces({
              key: i,
              name: e.name,
              latitude: e.geometry.location.lat,
              longitude: e.geometry.location.lng,
              photo: photo,
            })
          );
        })
      : '';
  }, [placesData]);

  //function to be called when a card get swiped right
  // const onLike = (obj) => {
  //     setIndex(index + 1)
  //      dispatch(addNewLike({obj}))
  // }

  const places = useSelector((state) => state.places.proximity);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (places.length > 0) {
    return (
      <View style={styles.container} onLayout={onLayoutRootView}>
        <Text style={styles.title}>Browse our suggestions</Text>
        <Swiper
          cards={places}
          index={index}
          renderCard={(card) => <Card card={card} />}
          // onSwipedRight={(i)=> console.log(i) }
          disableTopSwipe
          backgroundColor={'transparent'}
          marginTop={10}
          cardVerticalMargin={25}
          cardHorizontalMargin={10}
          disableBottomSwipe
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  backgroundColor: 'red',
                  color: '#fff',
                  fontSize: 20,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 10,
                  marginLeft: -10,
                },
              },
            },
            right: {
              title: 'LOVE',
              style: {
                label: {
                  backgroundColor: '#219EBC',
                  color: '#fff',
                  fontSize: 20,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 10,
                  marginLeft: 10,
                },
              },
            },
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '48%',
  },
  title: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

export default ExploreSwipe;
