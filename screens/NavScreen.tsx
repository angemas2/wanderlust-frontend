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
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import PositionContext from "../utils/context";
import MapView from "react-native-maps";
import { Marker, Polyline } from "react-native-maps";
import { Text } from "native-base";
import MapViewDirections from "react-native-maps-alternatives-directions";

export default function NavScreen() {
  const positionContext = useContext(PositionContext);


  //List of around
  const [places, setPlaces] = useState([]);
  //Places where user want to go
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

  const GOOGLE_MAPS_APIKEY = "AIzaSyCveSLV5eqlnggp-8nsCSh5zrGdTssTkVk";

  //Check if coord destination is empty if not show Marker
  const destination = destinationCoord?.latitude ? (
    <Marker coordinate={destinationCoord} />
  ) : (
    ""
  );

  // const url = `http://overpass-api.de/api/interpreter?data=[out:json];node["tourism"="attraction"](around:10000,${positionContext?.latitude},${positionContext?.longitude});out body;`;

  const googleurl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${origin.latitude},${origin.longitude}&types=tourist_attraction&radius=5000&sensor=false&key=${GOOGLE_MAPS_APIKEY}`;
  //Request to api / depend of user location
  useEffect(() => {
    (async () => {
      fetch(googleurl)
        .then((response) => response.json())
        .then((data: any) => {
          setPlaces(data.results);
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

  const placestosee = places?.map((data: any, i) => {
    let photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&photo_reference=${data.photos[0].photo_reference}&key=${GOOGLE_MAPS_APIKEY}`;
    return (
      <View style={styles.place} key={i}>
        <Image style={styles.placeimg} source={{ uri: photo }}></Image>
        <View style={styles.placeinfos}>
          <Text
            isTruncated
            maxW="300"
            style={{ fontSize: 10, fontWeight: "bold", marginLeft: 5 }}
          >
            {data.name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#FFB703",
              marginLeft: 5,
              marginRight: 15,
            }}
          >
            {origin &&
              getDistance(
                origin?.latitude,
                data.geometry.location.lat,
                origin?.longitude,
                data.geometry.location.lng
              )}
            {"km  "}
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
                style={{ marginLeft: 30, color: "#FFB703" }}
              />
            </Pressable>
          </Text>
        </View>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Let's Explore</Text>
      <MapView
        initialRegion={{
          latitude: positionContext?.latitude,
          longitude: positionContext?.longitude,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0421,
        }}
        style={styles.map}
      >
        <Marker
          draggable
          coordinate={{
            latitude: origin.latitude,
            longitude: origin.longitude,
          }}
          pinColor={"#FFB703"}
          onDragEnd={(e) =>
            setOrigin({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            })
          }
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
          onStart={(params) => {
            console.log(
              `Started routing between "${params.origin}" and "${params.destination}"`
            );
          }}
        />
      </MapView>
      <View>
        <View style={styles.aroundContainer}>
          <Text style={styles.subtitle}>Around Me</Text>
          <Text style={styles.desc}>
            Let yourself be guided by our travel buddy & discover the hidden
            gems around you
          </Text>
          <ScrollView horizontal={true} style={styles.placesCont}>
            {placestosee}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    paddingTop: 60,
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#023047",
    textAlign: "center",
  },
  map: {
    height: "30%",
    width: "95%",
    alignSelf: "center",
  },
  desc: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 15,
  },
  aroundContainer: {
    marginTop: 20,
    marginLeft: 15,
  },
  subtitle: {
    color: "#023047",
    fontSize: 16,
    fontWeight: "bold",
  },
  placesCont: {
    display: "flex",
    flexDirection: "row",
  },
  place: {
    width: 150,
    marginRight: 20,
  },
  placeimg: {
    width: 150,
    height: 130,
    borderRadius: 10,
  },
  placeinfos: {
    marginTop: 5,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
