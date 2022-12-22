import React, { useContext, useRef } from "react";
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

export default function ItinerarySummaryScreen({ route }: any) {
  const { _id, profile_id, name, viewpoints_id, description, followers } =
    route.params;

  const positionContext = useContext(PositionContext);
  const user = useSelector((state: { user: any }) => state.user.value);

  //get intermediate points between start and end
  let waypoints = viewpoints_id.slice(0, -1).map((e: any) => e.location);

  //add a marker for each step of the itinerary
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
              pinColor={"#FFB703"}
            />
          );
        })
      : "";

  let map: any = useRef(null);

  //zoom on the map to fit the marker
  async function fitMapToMarkers() {
    map.fitToCoordinates(waypoints, {
      edgePadding: {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30,
      },
    });
  }

  //show the info and image of each point of interest in the itinerary
  const steps = viewpoints_id.map((data: any, i: number) => {
    return (
      <View style={styles.place} key={i}>
        <Image source={{ uri: data.photos }} style={styles.placeimg}></Image>
        <Text
          style={{
            width: 150,
            fontWeight: "bold",
            color: "#023047",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          {data.name}
        </Text>
      </View>
    );
  });

  const GOOGLE_MAPS_APIKEY: any = process.env.GOOGLE_MAPS_API;

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: "#219EBC",
          padding: 20,
          position: "absolute",
          height: "15%",
          top: -20,
          width: "100%",
        }}
      ></View>
      <Image
        source={{ uri: user.picture }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 50,
          marginBottom: 10,
          borderColor: "white",
          borderWidth: 4,
        }}
      ></Image>

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 15,
          color: "#023047",
        }}
      >
        {" "}
        {name}{" "}
      </Text>
      <Text
        style={{
          textAlign: "center",
          marginBottom: 15,
          width: 350,
          color: "#023047",
        }}
      >
        {" "}
        {description}{" "}
      </Text>
      <MapView
        ref={(ref) => (map = ref)}
        initialRegion={{
          latitude: viewpoints_id[0].location.latitude,
          longitude: viewpoints_id[0].location.longitude,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0421,
        }}
        style={{ width: "100%", height: "40%" }}
        onMapReady={fitMapToMarkers}
      >
        <MapViewDirections
          origin={{
            latitude: viewpoints_id[0].location.latitude,
            longitude: viewpoints_id[0].location.longitude,
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
          onReady={(result) => console.log(result.distance)}
        />
        {point}
      </MapView>
      <Text
        style={{ color: "#023047", fontSize: 16, marginTop: 15, width: "90%" }}
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
    justifyContent: "center",
    paddingTop: "15%",
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
});
