import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getDefaultPlaces } from '../reducers/places';
import Card from './Card';
import PositionContext from '../utils/context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/dev'; //import fonts
import { PlaceState } from '../reducers/places'

interface UserPosition {
  latitude: number;
  longitude: number;
}

type Photo = {
  photo_reference: string;
};

type Element = {
  name: string,
  geometry: {
    location: {
      lat: number,
      lng: number
    }
  },
  photos: Photo[]
};

function ExploreSwipe() {
  //API key
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCveSLV5eqlnggp-8nsCSh5zrGdTssTkVk';
  //Font variable
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });
  //Get the user location inside the context define in App.tsx
  const userPosition: UserPosition = useContext(PositionContext);
  //Variable for calling useDispatch
  const dispatch = useDispatch();
  //Variable that posses all the places in a cetrain perimeter. 
  const places = useSelector((state: { places: PlaceState }) => state.places.value.proximity);
  //Array of places with all information in a certain perimeter.
  const [placesData, setPlacesData] = useState([]);
  //Index used <Swiper/> to reference all card, still need optimisation.
  const [index, setIndex] = useState<number>(0);


  //Request to get places in a certain perimeter, and give the response to placesData 
  useEffect(() => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userPosition.latitude},${userPosition.longitude}&types=tourist_attraction&radius=5000&sensor=false&key=${GOOGLE_MAPS_APIKEY}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPlacesData(data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //UseEffet listening to update on placesData and verifing thats placesData isnt empty.
  //At the end dispatching to proxyimity array in places reducer.
  useEffect(() => {
    placesData.length > 0
      ? placesData.map((e: Element, i: number) => {
        let photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${e.photos[0].photo_reference}&key=${GOOGLE_MAPS_APIKEY}`;
        if (e.photos[0] === undefined) {
          photo = '';
        }
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


  //Snippet code to initialize fonts
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }


  //Making sure places isnt empty to avoid error.
  if (places.length > 0) {
    return (
      <View style={styles.container} onLayout={onLayoutRootView}>
        <Text style={styles.title}>Browse our suggestions</Text>
        <Swiper
          cards={places}
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
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }
}


//Variable containing style object
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_400Regular',
    marginBottom: 20,
  },
});


export default ExploreSwipe;



