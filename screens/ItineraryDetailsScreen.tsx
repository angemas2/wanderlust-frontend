import React, { useContext, useRef, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  View,
  Image,
  ScrollView,
} from "react-native";
import MapViewDirections from "react-native-maps-alternatives-directions";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import PositionContext from "../utils/context";
import { Box, Input, Button, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons"; //import icons displayed in form's fields
import user from "../reducers/user";
import { useSelector } from "react-redux";
import { TheNautigal_400Regular } from "@expo-google-fonts/dev";

export default function ItineraryDetailsScreen({ route, navigation }: any) {
  const { _id, profile_id, name, viewpoints_id, description, followers } =
    route.params;

  const positionContext = useContext(PositionContext);
  const user = useSelector((state: { user: any }) => state.user.value);
  const [started, setStarted] = useState(false);
  const [distance, setDistance] = useState(0);
  const [direction, setDirection] = useState("");
  const [duration, setDuration] = useState(0);

  let waypoints = viewpoints_id.slice(0, -1).map((e: any) => e.location);

  const point =
    viewpoints_id.length > 0
      ? viewpoints_id.map((e: any, i: number) => {
          return (
            <Marker
              key={i}
              title={e.name}
              coordinate={{
                latitude: e.location.latitude,
                longitude: e.location.longitude,
              }}
            />
          );
        })
      : "";

  const steps = viewpoints_id.map((data: any, i: number) => {
    return (
      <View style={styles.place} key={i}>
        <Image source={{ uri: data.photos }} style={styles.placeimg}></Image>
        <Text style={{ width: 150, textAlign: "center", color: "#023047" }}>
          {data.name}
        </Text>
      </View>
    );
  });

  const GOOGLE_MAPS_APIKEY: any = process.env.GOOGLE_MAPS_API;

  let map: any = useRef(null);

  async function fitMapToMarkers() {
    map.fitToCoordinates(
      viewpoints_id.map((e: any) => e.location),
      {
        edgePadding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
      }
    );
  }

  const handleFollow = () => {
    fetch("https://wanderlust-backend.vercel.app/itineraries/followers", {
      method: "Put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.profile_id,
        id: _id,
      }),
    }).then(() => {
      navigation.navigate("MyTrips");
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 18,
          textAlign: "center",
          width: "80%",
          color: "#023047",
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          textAlign: "center",
          width: "80%",
          marginTop: 15,
          marginBottom: 20,
          color: "#023047",
          opacity: 0.6,
        }}
      >
        {description}
      </Text>
      <MapView
        ref={(ref) => (map = ref)}
        initialRegion={{
          latitude: positionContext.latitude,
          longitude: positionContext.longitude,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
        style={{ width: "95%", height: "40%" }}
        onMapReady={fitMapToMarkers}
      >
        <MapViewDirections
          origin={{
            latitude: positionContext.latitude,
            longitude: positionContext.longitude,
          }}
          destination={{
            latitude: viewpoints_id[viewpoints_id.length - 1].location.latitude,
            longitude:
              viewpoints_id[viewpoints_id.length - 1].location.longitude,
          }}
          waypoints={waypoints}
          optimizeWaypoints={true}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="#219EBC"
          precision="high"
          mode="WALKING"
          onReady={(result) => {
            let maneuver;
            let step = result.legs[0].steps[0].distance.text.includes("km")
              ? "km"
              : "m";
            if (step === "km" && result.legs[0].steps[0].distance.value < 0.3) {
              //@ts-ignore
              maneuver = `in ${result?.legs[0]?.steps[1].distance.text} ${result?.legs[0]?.steps[1]?.maneuver}`;
            } else if (
              step === "m" &&
              result.legs[0].steps[0].distance.value < 30
            ) {
              //@ts-ignore
              maneuver = `in ${result?.legs[0]?.steps[1]?.distance.text} ${result.legs[0].steps[1].maneuver}`;
            } else {
              maneuver = `continue for ${result.legs[0].steps[0].distance.text}`;
            }
            //@ts-ignore
            console.log(result.legs[0].steps[1]);
            setDistance(result.distance);
            setDuration(result.duration);
            setDirection(maneuver);
            console.log(result);
          }}
        />
        {point}
      </MapView>
      {!started ? (
        ""
      ) : (
        <View style={styles.direction}>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
              minWidth: 80,
            }}
          >
            <Text style={{ fontSize: 10, opacity: 0.9 }}>Total km</Text>
            <Text style={{ color: "#023047" }}>
              {distance ? distance : ""} km
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: 80,
            }}
          >
            <Text style={styles.DirectionContent}>Total time</Text>
            <Text style={{ color: "#023047" }}>{duration.toFixed(0)} min</Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: 80,
            }}
          >
            <Text style={styles.DirectionContent}>Direction</Text>
            <Text
              style={{
                color: "#023047",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {direction}
            </Text>
          </View>
        </View>
      )}
      <Pressable>
        <Button
          style={styles.startBtn}
          onPress={() => {
            setStarted(!started);
            started && handleFollow();
          }}
        >
          {started ? "Stop" : "Start"}
        </Button>
      </Pressable>

      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
          marginTop: 60,
          color: "#023047",
          width: "90%",
        }}
      >
        Itinerary Steps
      </Text>
      <ScrollView horizontal={true} style={styles.placesCont}>
        {steps}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 80,
  },
  placesCont: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 15,
  },
  placeimg: {
    marginBottom: 15,
    width: "100%",
    height: 120,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  place: {
    width: 160,
    marginRight: 20,
    marginTop: 20,
    height: 180,
    backgroundColor: "white",
    borderRadius: 15,
    paddingBottom: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginBottom: 5,
  },
  startBtn: {
    backgroundColor: "#FBBF13",
    width: 80,
    height: 80,
    color: "white",
    borderRadius: 50,
    top: -35,
    alignSelf: "center",
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  direction: {
    position: "absolute",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    top: 200,
    left: 40,

    backgroundColor: "white",

    padding: 10,
    borderRadius: 15,
    width: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  DirectionContent: {
    fontSize: 10,
    opacity: 0.9,
    marginRight: 10,
    color: "#023047",
  },
});
