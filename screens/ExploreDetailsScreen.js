import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  Button,
} from "react-native";
import { useContext, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import MapViewDirections from "react-native-maps-alternatives-directions";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import PositionContext from "../utils/context";

export default function ExploreDetailsScreen({ navigation }) {
  const GOOGLE_MAPS_APIKEY = "AIzaSyCveSLV5eqlnggp-8nsCSh5zrGdTssTkVk";

  const positionContext = useContext(PositionContext);
  const userPosition = {
    latitude: positionContext.latitude,
    longitude: positionContext.longitude,
  };
  const user = useSelector((state) => state.user.value);

  const [idsList, setIdsList] = useState([]);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [status, setStatus] = useState(false);

  const likedPlace = useSelector((state) => state.places.liked);

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

  let btnText;
  if (status) {
    btnText = "Stop";
  } else {
    btnText = "Start";
  }

  const getIds = async () => {
    const ids = [];
    return likedPlace.map((data) => {
      fetch("https:wanderlust-backend.vercel.app/viewpoints/addPoint", {
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
          return ids;
        });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        initialRegion={{
          latitude: positionContext.latitude,
          longitude: positionContext.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.map}
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
        style={styles.startBtn}
        disabled={!status&&idsList.length<likedPlace.length}
        onPress={() => {
          setStatus(!status);
          if (!status) {
            getIds();
          } else {
            navigation.navigate("ExploreSave", {
              idsList,
              distance,
              duration,
            });
          }
        }}
      >
        <Text>{btnText}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  map: {
    height: "75%",
    width: "95%",
    borderRadius: 10,
  },
  startBtn: {
    backgroundColor: "#FBBF13",
    width: 70,
    height: 70,
    color: "white",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
