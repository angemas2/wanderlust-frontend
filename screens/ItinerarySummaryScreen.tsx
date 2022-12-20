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

  const steps = viewpoints_id.map((data: any, i: number) => {
    return (
      <View style={styles.place} key={i}>
        <Image source={{ uri: data.photos }} style={styles.placeimg}></Image>
        <Text style={{ width: 150 }}>{data.name}</Text>
      </View>
    );
  });

  const GOOGLE_MAPS_APIKEY: any = process.env.GOOGLE_MAPS_API;


  return (
    <SafeAreaView style={styles.container}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          {" "}
          {name}{" "}
        </Text>
        <Text style={{ textAlign: "center", marginBottom: 30, width: 350 }}>
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
          style={{ width: "95%", height: "40%" }}
          onMapReady={fitMapToMarkers}
        >
          <MapViewDirections
            origin={{
              latitude: viewpoints_id[0].location.latitude,
              longitude: viewpoints_id[0].location.longitude,
            }}
            destination={{
              latitude:
                viewpoints_id[viewpoints_id.length - 1].location.latitude,
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
        <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 15 }}>
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
    paddingTop: "20%",
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
});
