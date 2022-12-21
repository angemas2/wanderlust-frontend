import React, { useContext, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import getDistance from "../modules/getDistance";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCirclePlay, faStar } from "@fortawesome/free-solid-svg-icons";
import PositionContext from "../utils/context";
import MapView from "react-native-maps";
import { Marker, Polyline } from "react-native-maps";
import { Text } from "native-base";
import MapViewDirections from "react-native-maps-alternatives-directions";
import * as Location from "expo-location";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import Header from "../components/Header";

type NavScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function NavScreen({ navigation }: NavScreenProps) {
  const positionContext = useContext(PositionContext);

  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [direction, setDirection] = useState<string>("");

  const [destinationCoord, setDestinationCoord] = useState<{
    latitude: number;
    longitude: number;
  }>();

  //Position of user or new position if marker get dragged
  const [origin, setOrigin] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: positionContext?.latitude,
    longitude: positionContext?.longitude,
  });

  const GOOGLE_MAPS_APIKEY: any = process.env.GOOGLE_MAPS_API;

  //Check if coord destination is empty if not show Marker
  const destination = destinationCoord?.latitude ? (
    <Marker coordinate={destinationCoord} />
  ) : (
    ""
  );

  // const url = `http://overpass-api.de/api/interpreter?data=[out:json];node["tourism"="attraction"](around:10000,${positionContext?.latitude},${positionContext?.longitude});out body;`;

  const googleurl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${origin.latitude},${origin.longitude}&types=tourist_attraction&radius=10000&sensor=false&key=${GOOGLE_MAPS_APIKEY}`;
  //Request to api / depend of user location
  useEffect(() => {
    setLoading(true);
    (async () => {
      fetch(googleurl)
        .then((response) => response.json())
        .then((data: any) => {
          if (data.results) {
            setPlaces(data.results);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, [origin]);

  //
  const handleNavigateToPlace = (lat: number, lon: number) => {
    setDestinationCoord({ latitude: lat, longitude: lon });
  };

  // watch position of the user when navigating
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setOrigin({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        });
      }
    })();
  }, []);

  const placestosee =
    !loading &&
    places?.map((data: any, i) => {
      let photo = "";
      if (data.photos[0]) {
        photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${data.photos[0].photo_reference}&key=${GOOGLE_MAPS_APIKEY}`;
      }
      return (
        <View style={styles.place} key={i}>
          {photo !== "" ? (
            <Image style={styles.placeimg} source={{ uri: photo }}></Image>
          ) : (
            <Image
              style={styles.placeimg}
              source={require("../assets/images/background.png")}
            ></Image>
          )}
          <Text style={styles.rating}>
            <FontAwesomeIcon
              icon={faStar}
              style={{ marginRight: 30, color: "#FFB703" }}
              size={11}
            />
            {data.rating}
          </Text>
          <View style={styles.placeinfos}>
            <View style={{display:"flex", justifyContent:"center",width:"50%"}}>
              <Text
                isTruncated
                maxW="120"
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  marginLeft: 5,
                  
                }}
              >
                {data.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#FFB703",
                  fontWeight: "bold",
                  marginLeft: 5,
                  marginRight: 15,
                }}
              >
                {positionContext &&
                  getDistance(
                    positionContext?.latitude,
                    data.geometry.location.lat,
                    positionContext?.longitude,
                    data.geometry.location.lng
                  )}
                {"km  "}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                handleNavigateToPlace(
                  data.geometry.location.lat,
                  data.geometry.location.lng
                );
              }}
            >
              <FontAwesomeIcon
                icon={faCirclePlay}
                style={{ marginLeft: 40, color: "#219EBC", marginRight: 10 }}
                size={20}
              />
            </Pressable>
          </View>
        </View>
      );
    });

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} title="Let's Discover what's around!" />
      <MapView
        initialRegion={{
          latitude: positionContext?.latitude,
          longitude: positionContext?.longitude,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0421,
        }}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        <Marker
          draggable
          coordinate={{
            latitude: origin.latitude,
            longitude: origin.longitude,
          }}
          pinColor={"#FFB703"}
          onDragEnd={(e) => {
            setOrigin({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
            console.log(origin);
          }}
        />
        {destination}

        <MapViewDirections
          origin={origin}
          destination={destinationCoord}
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
          }}
          onStart={(x) => console.log("started", x)}
        />
      </MapView>
      {distance === 0 ? (
        ""
      ) : (
        <View
          style={{
            position: "absolute",
            top: 300,

            backgroundColor: "rgba(2, 48, 71, 0.8)",

            padding: 10,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <Text style={{ color: "white" }}>Distance:{distance} km </Text>
          <Text style={{ color: "white" }}>
            Duration: {duration.toFixed(0)}
          </Text>
          <Text style={{ color: "white" }}>Direction: {direction}</Text>
        </View>
      )}

      <View>
        <View style={styles.aroundContainer}>
          <Text style={styles.subtitle}>Around Me</Text>
          <Text style={styles.desc}>
            Let yourself be guided by our travel buddy & discover the hidden
            gems around you
          </Text>
          <ScrollView horizontal={true} style={styles.placesCont}>
            {!loading && placestosee}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  map: {
    height: "40%",
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  desc: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 20,
  },
  aroundContainer: {
    marginTop: 10,
    marginLeft: 15,
  },
  subtitle: {
    color: "#023047",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  placesCont: {
    display: "flex",
    flexDirection: "row",
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
  placeimg: {
    width: "100%",
    height: 120,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  placeinfos: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  rating: {
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#023047",
    fontSize: 10,
    paddingTop: 5,
    paddingBottom: 5,
    width: 50,
    textAlign: "center",
    borderRadius: 8,
  },
});
