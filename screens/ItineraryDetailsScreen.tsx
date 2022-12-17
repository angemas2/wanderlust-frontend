import React, { useContext } from "react";
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

export default function ItineraryDetailsScreen({ route }: any) {
  const { profile_id, name, viewpoints_id, description } = route.params;

  const positionContext = useContext(PositionContext);

  let waypoints = viewpoints_id.slice(1, -1).map((e: any) => e.location);

  console.log(viewpoints_id[0].photos);

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

  return (
    <SafeAreaView style={styles.container}>
      <Text>Details test screen 2</Text>
      <Text>{description}</Text>
      <MapView
        initialRegion={{
          latitude: positionContext.latitude,
          longitude: positionContext.longitude,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0421,
        }}
        style={{ width: "100%", height: "50%" }}
        
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
          onReady={(result) => console.log(result.distance)
         }
        />
        {point}
      </MapView>
      <Pressable>
        <Button style={styles.startBtn}>Start</Button>
      </Pressable>

      <Text>Itinerary Steps</Text>
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
    marginTop: 50,
  },
  startBtn: {
    backgroundColor: "#FBBF13",
    width:70,
    height:70,
    color:"white",
    borderRadius:50,
  },
});
