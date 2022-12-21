import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  View,
  Image
} from "react-native";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import MapViewDirections from "react-native-maps-alternatives-directions";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import PositionContext from "../utils/context";
import { Button } from "native-base";
import { PlaceState } from '../reducers/places'

type Props = {
  navigation: any;
};

export default function ExploreDetailsScreen({ navigation }: Props) {
  const GOOGLE_MAPS_APIKEY = "AIzaSyCveSLV5eqlnggp-8nsCSh5zrGdTssTkVk";

  const positionContext = useContext(PositionContext);
  const userPosition = {
    latitude: positionContext.latitude,
    longitude: positionContext.longitude,
  };
  const user = useSelector((state: any) => state.user.value);

  const [idsList, setIdsList] = useState<string[]>([]);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [status, setStatus] = useState<boolean>(false);

  const likedPlace = useSelector((state: { places: PlaceState }) => state.places.value.liked);

  const wayPoints = likedPlace.map((e: any) => {
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
      ? likedPlace.map((e: any, i: number) => {
        return (
          <Marker
            key={i}
            title={e.name}
            coordinate={{ latitude: e.latitude, longitude: e.longitude }}
          />
        );
      })
      : ""


  const getIds = async () => {
    const ids: string[] = [];
    return likedPlace.map((data: any) => {
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
        .then((res: any) => res.json())
        .then((data: any) => {
          console.log("data id list", data.data._id);
          ids.push(data.data._id);
          setIdsList(ids);
          return ids;
        });
    });
  };


  const steps = likedPlace.map((e, i) => {
    console.log(e.photo)
    return (
      <View key={i}>
        <Image source={{ uri: e.photo }} style={styles.placeimg}></Image>
        <Text style={{ width: 150 }}>{e.name}</Text>
      </View>
    );
  });


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
      <Pressable>
        <Button
          style={styles.startBtn}
          // disabled={!status && idsList.length < likedPlace.length}
          onPress={async () => {
            if (!status) {
              await getIds().then(setStatus(!status))
            } else {
              navigation.navigate("ExploreSave", {
                idsList,
                distance,
                duration,
              });
            }
          }}
        >
          {status ? "Stop" : "Start"}
        </Button>
      </Pressable>
      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: "15%" }}>
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
    height: "100%",
    alignItems: "center",
  },
  map: {
    height: "65%",
    width: "95%",
    borderRadius: 10,
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
  placesCont: {
    display: "flex",
    flexDirection: "row",
    marginTop: "5%",
    marginLeft: "5%",
  },
  placeimg: {
    width: 150,
    height: 130,
    borderRadius: 10,
    marginBottom: 15,
  },
});
