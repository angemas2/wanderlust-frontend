import React, { useEffect, useState, useContext, useCallback } from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import Swiper from "react-native-deck-swiper";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addNewLike, getDefaultPlaces } from "../reducers/places";
import Card from "./Card";
import PositionContext from "../utils/context";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/dev"; //import fonts
import { PlaceState } from "../reducers/places";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import {
  Modal,
  FormControl,
  Input,
  Button,
  Slider,
  Select,
  Box,
} from "native-base";

interface UserPosition {
  latitude: number;
  longitude: number;
}

type Photo = {
  photo_reference: string;
};

type Element = {
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos: Photo[];
  description: string;
  rating: number;
  user_ratings_total: number;
};

function ExploreSwipe() {
  //API key
  const GOOGLE_MAPS_APIKEY = process.env.GOOGLE_MAPS_API;
  //Font variable
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });
  //Get the user location inside the context define in App.tsx
  const userPosition: UserPosition = useContext(PositionContext);
  //Variable for calling useDispatch
  const dispatch = useDispatch();
  //Variable that posses all the places in a cetrain perimeter.
  const places = useSelector(
    (state: { places: PlaceState }) => state.places.value.proximity
  );
  //Array of places with all information in a certain perimeter.
  const [placesData, setPlacesData] = useState([]);
  //Index used <Swiper/> to reference all card, still need optimisation.
  const [index, setIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [onChangeEndValue, setOnChangeEndValue] = useState(5);
  const monumentRange = onChangeEndValue * 1000;

  //Request to get places in a certain perimeter, and give the response to placesData
  useEffect(() => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userPosition.latitude},${userPosition.longitude}&types=tourist_attraction&radius=10000&sensor=false&key=${GOOGLE_MAPS_APIKEY}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPlacesData(data.results);
        console.log(data.results[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [onChangeEndValue]);
  //UseEffet listening to update on placesData and verifing thats placesData isnt empty.
  //At the end dispatching to proxyimity array in places reducer.
  useEffect(() => {
    placesData.length > 0
      ? placesData.map((e: Element, i: number) => {
          let photo = "";
          if (e.photos && e.photos.length > 0) {
            photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${e.photos[0].photo_reference}&key=${GOOGLE_MAPS_APIKEY}`;
          }
          dispatch(
            getDefaultPlaces({
              key: i,
              name: e.name,
              latitude: e.geometry.location.lat,
              longitude: e.geometry.location.lng,
              photo: photo,
              rating: e.rating,
              ratingTotal: e.user_ratings_total,
            })
          );
        })
      : "";
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
        <View style={styles.topContainer}>
          <Text style={styles.title}>Browse our suggestions</Text>
          <Pressable onPress={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faFilter} size={20} style={styles.icon} />
          </Pressable>
        </View>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Filter</Modal.Header>
            <Modal.Body>
              <Text>{onChangeEndValue} km</Text>
              <Box>
                <Slider
                  w="3/4"
                  maxW="300"
                  defaultValue={5}
                  minValue={5}
                  maxValue={50}
                  accessibilityLabel="hello world"
                  step={5}
                  onChange={(v) => {
                    setOnChangeEndValue(Math.floor(v));
                  }}
                >
                  <Slider.Track>
                    <Slider.FilledTrack />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider>
              </Box>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  Save
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <Swiper
          cards={places}
          renderCard={(card) => <Card card={card} />}
          onSwipedRight={(i) => dispatch(addNewLike(places[i]))}
          disableTopSwipe
          backgroundColor={"transparent"}
          swipeAnimationDuration={600}
          marginTop={10}
          cardVerticalMargin={25}
          cardHorizontalMargin={10}
          disableBottomSwipe
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  backgroundColor: "red",
                  color: "#fff",
                  fontSize: 20,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 10,
                  marginLeft: -10,
                },
              },
            },
            right: {
              title: "LOVE",
              style: {
                label: {
                  backgroundColor: "#219EBC",
                  color: "#fff",
                  fontSize: 20,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
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

    marginTop: 15,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  icon: {
    color: "#FFB703",
    marginRight: 10,
  },
});

export default ExploreSwipe;
