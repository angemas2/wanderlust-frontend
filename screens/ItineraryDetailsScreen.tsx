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

export default function ItineraryDetailsScreen({ route }: any) {
  const { _id, profile_id, name, viewpoints_id, description, followers } =
    route.params;

  const positionContext = useContext(PositionContext);
  const user = useSelector((state: { user: any }) => state.user.value);

  let waypoints = viewpoints_id.slice(0, -1).map((e: any) => e.location);

  console.log(_id);

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
        <Text style={{ width: 150 }}>{data.name}</Text>
      </View>
    );
  });

  const GOOGLE_MAPS_APIKEY: any = process.env.GOOGLE_MAPS_API;

  let map: any = useRef(null);

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

  const handleFollow = () => {
    fetch("https://wanderlust-backend.vercel.app/itineraries/followers", {
      method: "Put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.profile_id._id,
        id: _id,
      }),
    });
    console.log("followed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 18,
          textAlign: "center",
          width: "80%",
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
          onReady={(result) => console.log(result.distance)}
        />
        {point}
      </MapView>
      <Pressable>
        <Button
          style={styles.startBtn}
          onPress={() => {
            handleFollow();
          }}
        >
          Start
        </Button>
      </Pressable>

      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 60 }}>
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
    width: 150,
    height: 130,
    borderRadius: 10,
    marginBottom: 15,
  },
  place: {
    width: 150,
    marginRight: 20,
    marginTop: 30,
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
});
