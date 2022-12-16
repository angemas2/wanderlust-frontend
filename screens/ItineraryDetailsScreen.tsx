import React, { useContext } from "react";
import { SafeAreaView, Text, StyleSheet, Pressable } from "react-native";
import MapViewDirections from "react-native-maps-alternatives-directions";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import PositionContext from "../utils/context";

export default function ItineraryDetailsScreen({ route }: any) {
  const { name, viewpoints_id, description } = route.params;

  const positionContext = useContext(PositionContext);

  console.log(viewpoints_id[1].location.latitude);

  const GOOGLE_MAPS_APIKEY: any = process.env.GOOGLE_MAPS_API;

  return (
    <SafeAreaView style={styles.container}>
      <Text>Details test screen</Text>
      <MapView
        initialRegion={{
          latitude: 40,
          longitude: 30,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0421,
        }}
        style={{ width: "100%", height: "50%" }}
      ></MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
