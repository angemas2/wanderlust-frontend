import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import React, { useContext, useState, useCallback, useRef } from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import PositionContext from "../utils/context";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import MapViewDirections from "react-native-maps-alternatives-directions";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleArrowUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { setSwipeVisibility } from "../reducers/places";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/dev"; //import to handle the Roboto font
import * as SplashScreen from "expo-splash-screen";
import { PlaceState } from "../reducers/places";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { color } from "native-base/lib/typescript/theme/styled-system";

interface ExploreMapProps {
  navigation: NavigationProp<ParamListBase>;
}

const ExploreMap: React.FC<ExploreMapProps> = ({ navigation }) => {
  SplashScreen.preventAutoHideAsync();
  //API key
  const GOOGLE_MAPS_APIKEY = "AIzaSyCveSLV5eqlnggp-8nsCSh5zrGdTssTkVk";
  //Variable for calling useDispatch
  const dispatch = useDispatch();
  //true or false sended from reducer places, used to choose a style for ExploreMap component if swipe component is visble or not.
  const visible = useSelector(
    (state: { places: PlaceState }) => state.places.value.isSwipeVisible
  );
  //Variable that posses all the places that have been liked by the user
  const likedPlace = useSelector(
    (state: { places: PlaceState }) => state.places.value.liked
  );
  //Get the context that contain the user position define in App.tsx
  const positionContext = useContext(PositionContext);
  const userPosition = {
    latitude: positionContext.latitude,
    longitude: positionContext.longitude,
  };

  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);

  //Style object
  let container = {};
  //Setting diferent style to container if visible is true
  if (visible) {
    container = {
      display: "flex",
      height: "50%",
      width: "100%",
      alignItems: "center",
      marginTop: "2%",
    };
  }
  //Setting diferent style to container if visible is false
  else {
    container = {
      display: "flex",
      height: "100%",
      width: "100%",
      alignItems: "center",
      marginTop: "7%",
    };
  }
  //Style object
  let map = {};
  //Setting diferent style to map if visible is true
  if (visible) {
    map = {
      height: "60%",
      width: "95%",
      borderRadius: 10,
      marginTop: "3%",
    };
  }
  //Setting diferent style to map if visible is false
  else {
    map = {
      height: "80%",
      width: "95%",
      borderRadius: 10,
    };
  }

  const handleVisible = () => {
    dispatch(setSwipeVisibility());
  };

  const wayPoints = likedPlace.map((e) => {
    return { latitude: e.latitude, longitude: e.longitude };
  });

  const intinaries =
    positionContext != null && likedPlace.length > 0 ? (
      <MapViewDirections
        origin={userPosition}
        destination={{
          latitude: likedPlace[likedPlace.length - 1].latitude,
          longitude: likedPlace[likedPlace.length - 1].longitude,
        }}
        waypoints={wayPoints}
        optimizeWaypoints={true}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={4}
        strokeColor="#219EBC"
        precision="high"
        mode="WALKING"
        onReady={(result) => {
          setDuration(result.duration);
          setDistance(result.distance);
        }}
      />
    ) : (
      ""
    );

  const point =
    likedPlace.length > 0
      ? likedPlace.map((e, i) => {
          return (
            <Marker
              key={i}
              title={e.name}
              coordinate={{ latitude: e.latitude, longitude: e.longitude }}
            />
          );
        })
      : "";

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={container} onLayout={onLayoutRootView}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>My adventure</Text>
        <Text style={styles.distance}>
          {distance} km | {Math.floor(duration)} minutes
        </Text>
      </View>
      <Pressable style={styles.pressArrow} onPress={() => handleVisible()}>
        <FontAwesomeIcon
          icon={visible ? faCircleArrowUp : faXmark}
          style={styles.icon}
          size={30}
        />
      </Pressable>
      <MapView
        initialRegion={{
          latitude: positionContext.latitude,
          longitude: positionContext.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={map}
      >
        <Marker
          draggable
          coordinate={{
            latitude: positionContext.latitude,
            longitude: positionContext.longitude,
          }}
          pinColor={"#FFB703"}
        />
        {point}
        {intinaries}
      </MapView>
      <Pressable
        style={styles.btn}
        onPress={() => navigation.navigate("ExploreDetails")}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Start exploring
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    width: "100%",
  },
  title: {
    alignSelf: "flex-start",
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  btn: {
    backgroundColor: "#FFB703",
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 20,
    marginTop: "5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  icon: {
    color: "#FFB703",
    marginRight: 10,
  },
  startExploring: {
    fontFamily: "Inter_500Medium",
    color: "white",
    fontSize: 16,
  },
  pressArrow: {
    position: "absolute",
    alignSelf: "flex-end",
    marginTop: 10,
    zIndex: 1,
  },
  distance: {
    marginLeft: "3%",
    color: "#219EBC",
    fontWeight: "bold",
  },
});

export default ExploreMap;
