import React, { useContext, useRef, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  View,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import MapViewDirections from "react-native-maps-alternatives-directions";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import PositionContext from "../utils/context";
import { Box, Input, Button, Icon, Row } from "native-base";
import { MaterialIcons } from "@expo/vector-icons"; //import icons displayed in form's fields
import user from "../reducers/user";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { Buffer } from "buffer";
import { flexbox } from "native-base/lib/typescript/theme/styled-system";
import ImageViewer from "react-native-image-zoom-viewer";

export default function ItinerarySummaryScreen({ route }: any) {
  const { _id, profile_id, name, itinerary_id, photos } = route.params;

  console.log(_id);
  const positionContext = useContext(PositionContext);
  const user = useSelector((state: { user: any }) => state.user.value);
  const [image, setImage] = useState<any>([]);
  const [zoom, setZoom] = useState(false);

  //enable user to add an image to his activity
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageData: any = result.assets[0].base64;

      const buffer = Buffer.from(imageData, "base64");

      try {
        const response = await fetch(
          `https://wanderlust-backend.vercel.app/activities/${_id}/addPictures`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "image/jpeg;chartset=utf8",
            },
            body: buffer,
          }
        );
        const data = await response.json();

        if (data) {
          setImage([data.data.photos]);
          console.log("upload success");
          console.log(data);
        } else {
          console.log("upload failed");
        }
      } catch (error) {
        console.log("upload failed", error);
      }
    }
  };

  //get intermediate points between start and end
  let waypoints = itinerary_id.viewpoints_id
    .slice(0, -1)
    .map((e: any) => e.location);

  //add a marker for each step of the itinerary
  const point =
    itinerary_id.viewpoints_id.length > 0
      ? itinerary_id.viewpoints_id.map((e: any, i: number) => {
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
  const steps = itinerary_id.viewpoints_id.map((data: any, i: number) => {
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

  //get user pictures of the itinerary
  const itineraryPhotos = photos.map((data: any, i: number) => {
    return (
      <View key={i} style={styles.photos}>
        <Pressable onPress={() => setZoom(!zoom)}>
          <Image
            source={{ uri: data }}
            style={{ width: 150, height: 150, borderRadius: 15 }}
          />
        </Pressable>
      </View>
    );
  });

  const images = photos.map((s: string) => ({ url: s }));

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
        {itinerary_id.name}{" "}
      </Text>
      <ScrollView contentContainerStyle={styles.ScrollView}>
        <Text
          style={{
            textAlign: "center",
            marginBottom: 15,
            width: 350,
            color: "#023047",
          }}
        >
          {" "}
          {itinerary_id.description}{" "}
        </Text>

        <MapView
          ref={(ref) => (map = ref)}
          initialRegion={{
            latitude: itinerary_id.viewpoints_id[0].location.latitude,
            longitude: itinerary_id.viewpoints_id[0].location.longitude,
            latitudeDelta: 0.0522,
            longitudeDelta: 0.0421,
          }}
          style={{ width: "100%", height: 230 }}
          onMapReady={fitMapToMarkers}
        >
          <MapViewDirections
            origin={{
              latitude: itinerary_id.viewpoints_id[0].location.latitude,
              longitude: itinerary_id.viewpoints_id[0].location.longitude,
            }}
            destination={{
              latitude:
                itinerary_id.viewpoints_id[
                  itinerary_id.viewpoints_id.length - 1
                ].location.latitude,
              longitude:
                itinerary_id.viewpoints_id[
                  itinerary_id.viewpoints_id.length - 1
                ].location.longitude,
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
          style={{
            color: "#023047",
            fontSize: 16,
            marginTop: 15,
            width: "90%",
          }}
        >
          Itinerary Steps
        </Text>
        <ScrollView horizontal={true} style={styles.placesCont}>
          {steps}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            width: "90%",
            marginTop: 15,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#023047",
              fontSize: 16,
            }}
          >
            Souvenirs ❤
          </Text>
          <Pressable onPress={pickImage}>
            <Icon
              as={MaterialIcons}
              name="add-photo-alternate"
              color="coolGray.800"
              size={7}
            />
          </Pressable>
        </View>
        <ScrollView horizontal={true} style={styles.placesCont}>
          {itineraryPhotos}
          <Modal
            visible={zoom}
            transparent={true}
            onRequestClose={() => setZoom(!zoom)}
          >
            <ImageViewer
              imageUrls={images}
              enableSwipeDown={true}
              onSwipeDown={() => {
                setZoom(!zoom);
              }}
            />
          </Modal>
        </ScrollView>
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
  ScrollView: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
  photos: {
    marginRight: 15,
    marginTop: 15,
  },
});
