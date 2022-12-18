import React from "react";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { useContext, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Pressable,
  Button,
} from "react-native";
import PositionContext from "../utils/context";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import MapViewDirections from "react-native-maps-alternatives-directions";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleArrowUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { setSwipeVisibility } from "../reducers/places";
import _ from "lodash";
import { UserState } from "../reducers/user";

function ExploreMap({ navigation }) {
  const dispatch = useDispatch();

  const [idsList, setIdsList] = useState([]);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);

  const GOOGLE_MAPS_APIKEY = "AIzaSyCveSLV5eqlnggp-8nsCSh5zrGdTssTkVk";

  //Get the context define in App.tsx
  const positionContext = useContext(PositionContext);

  const userPosition = {
    latitude: positionContext.latitude,
    longitude: positionContext.longitude,
  };

  const visible = useSelector((state) => state.places.isSwipeVisible);

  let container = {};
  if (visible) {
    container = {
      display: "flex",
      height: "50%",
      width: "100%",
      alignItems: "center",
    };
  } else {
    container = {
      display: "flex",
      height: "100%",
      width: "100%",
      alignItems: "center",
    };
  }

  let map = {};
  if (visible) {
    map = {
      height: "60%",
      width: "95%",
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
    };
  } else {
    map = {
      height: "80%",
      width: "95%",
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
    };
  }

  const likedPlace = useSelector((state) => state.places.liked);
  const user = useSelector((state) => state.user.value);

  const test = likedPlace.map((e) => {
    return { latitude: e.latitude, longitude: e.longitude };
  });

  const getIds = () => {
    const ids = [];
    likedPlace.map((data) => {
      fetch("https://wanderlust-backend.vercel.app/viewpoints/addPoint", {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          photos: data.photo,
          location: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
          tags_id: "",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("data id list", data.data._id);
          ids.push(data.data._id);
          setIdsList(ids);
        });
    });
  };

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

  const handleVisible = () => {
    dispatch(setSwipeVisibility());
  };

  const intinaries =
    positionContext != null && likedPlace.length > 0 ? (
      <MapViewDirections
        origin={userPosition}
        destination={{
          latitude: likedPlace[likedPlace.length - 1].latitude,
          longitude: likedPlace[likedPlace.length - 1].longitude,
        }}
        waypoints={test}
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

    console.log("user",user)

  return (
    <View style={container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>My adventure</Text>
        <Pressable onPress={() => handleVisible()}>
          <FontAwesomeIcon
            icon={visible ? faCircleArrowUp : faXmark}
            style={styles.icon}
            size={25}
          />
        </Pressable>
      </View>
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
        onPress={() => {
          getIds();
          fetch(
            "https://wanderlust-backend.vercel.app/itineraries/addItinerary",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                profile_id: user.profile_id,
                viewpointsList: idsList,
                km: distance,
                map: duration,
                photos: "",
                name: "Fun in Bruxelles by benjaduv 2",
                description:
                  "visite du parc du bois de la cambre et de son lac ainsi que des parcs autour (drhome, plaine, plateau d'avrij ...)",
                public: true,
                custom: true,
                isSponsor: false,
                city: "Bruxelles",
              }),
            }
          )
            .then((response) => response.json())
            .then((data) => console.log(data));
        }}
      >
        <Text>Start exploring</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    alignSelf: "flex-start",
    marginTop: 0,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Montserat",
  },
  btn: {
    backgroundColor: "#FFB703",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    borderRadius: 20,
    marginTop: 25,
  },
  icon: {
    color: "#219EBC",
    marginRight: 10,
  },
});

export default ExploreMap;
