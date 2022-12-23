import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  View,
  Image,
} from "react-native";
import { useContext, useState, useRef } from "react";
import { useSelector } from "react-redux";
import MapViewDirections from "react-native-maps-alternatives-directions";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import PositionContext from "../utils/context";
import { Button } from "native-base";
import { PlaceState, Proximity } from "../reducers/places";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { UserState } from "../reducers/user";
import { Dimensions } from "react-native";

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

export default function ExploreDetailsScreen({ navigation }: Props) {
  const GOOGLE_MAPS_APIKEY = "AIzaSyCveSLV5eqlnggp-8nsCSh5zrGdTssTkVk";

  const positionContext = useContext(PositionContext);
  const userPosition = {
    latitude: positionContext.latitude,
    longitude: positionContext.longitude,
  };

  const user = useSelector((state: { user: UserState }) => state.user.value);

  const [idsList, setIdsList] = useState<string[]>([]);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [status, setStatus] = useState<boolean>(false);
  const [direction, setDirection] = useState("");

  const likedPlace = useSelector(
    (state: { places: PlaceState }) => state.places.value.liked
  );

  const wayPoints = likedPlace.map((e: Proximity) => {
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
    ) : (
      ""
    );

  const point =
    likedPlace.length > 0
      ? likedPlace.map((e: Proximity, i: number) => {
          return (
            <Marker
              key={i}
              title={e.name}
              coordinate={{ latitude: e.latitude, longitude: e.longitude }}
            />
          );
        })
      : "";

  const getIds = async () => {
    const ids: string[] = [];
    return likedPlace.map((data: Proximity) => {
      fetch("https:wanderlust-backend.vercel.app/viewpoints/addPoint", {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: "",
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
    console.log(e.photo);

    const photo = !!e.photo
      ? { uri: `${e.photo}` }
      : require("../assets/images/background.png");
    return (
      <View key={i} style={styles.place}>
        <Image source={photo} style={styles.placeimg}></Image>
        <Text
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: 8,
            fontSize: 12,
            fontWeight: "bold",
            color: "#023047",
          }}
        >
          {e.name}
        </Text>
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
        showsUserLocation={true}
        followsUserLocation={true}
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
      {!status ? (
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
          // disabled={!status && idsList.length < likedPlace.length}

          onPress={async () => {
            if (!status) {
              await getIds().then(() => setStatus(!status));
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
      <View style={styles.distanceContainer}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            marginLeft: 10,
            color: "#023047",
          }}
        >
          Itinerary Steps
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            marginLeft: 10,
            color: "#219EBC",
          }}
        >
          {distance} km | {Math.floor(duration)} minutes
        </Text>
      </View>
      <ScrollView horizontal={true} style={styles.placesCont}>
        {steps}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    maxWidth: Dimensions.get("window").width,
    alignItems: "center",
  },
  map: {
    height: "65%",
    width: Dimensions.get("window").width,
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
    width: "100%",
    height: 120,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  place: {
    width: 160,
    marginRight: 18,
    backgroundColor: "white",
    borderRadius: 15,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  distanceContainer: {
    flexDirection: "row",
    marginTop: 60,
    alignItems: "center",
    justifyContent: "flex-start",
    width: Dimensions.get("window").width,
  },
  direction: {
    position: "absolute",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    top: 80,
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
