import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  View,
  Switch,
} from "react-native";
import { useContext, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import MapViewDirections from "react-native-maps-alternatives-directions";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import PositionContext from "../utils/context";
import { Box, Input, Icon, Button } from "native-base";

export default function ExploreSaveScreen({ route, navigation }) {
  const user = useSelector((state) => state.user.value);

  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);

  const toggleSwitch = () => setIsPublic(!isPublic);

  return (
    <SafeAreaView style={styles.container}>
       <Text style={styles.title}>Remember your adventure</Text>
      <View style={styles.name}>
        <Text>City</Text>
        <Input
          onChangeText={(value) => setCity(value)}
          vlaue={city}
          keyboardType="email-address"
          autoCapitalize="none"
          borderRadius={10}
          color="white"
          bgColor="rgba(2, 48, 71, 0.7)"
          w="100%"
        />
      </View>
      <View style={styles.name}>
        <Text>Name your road</Text>
        <Input
          onChangeText={(value) => setName(value)}
          vlaue={name}
          keyboardType="email-address"
          autoCapitalize="none"
          borderRadius={10}
          color="white"
          bgColor="rgba(2, 48, 71, 0.7)"
          w="100%"
        />
      </View>
      <View style={styles.description}>
        <Text>Say a litlle more</Text>
        <Input
          onChangeText={(value) => setDescription(value)}
          vlaue={description}
          keyboardType="email-address"
          autoCapitalize="none"
          borderRadius={10}
          color="white"
          bgColor="rgba(2, 48, 71, 0.7)"
          w="100%"
          h={200}
        />
      </View>
      <View style={styles.switch}>
        <Text>Private</Text>
        <Switch
          onValueChange={(e) => {
            toggleSwitch(e);
          }}
          value={isPublic}
        />
      </View>
      <View style={styles.btnContainer}>
        <Button>Dont save my road</Button>
        <Button
          onPress={() => {
            fetch(
              "https:wanderlust-backend.vercel.app/itineraries/addItinerary",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  profile_id: user.profile_id,
                  viewpointsList: route.params.idsList,
                  km: route.params.distance,
                  map: route.params.duration,
                  photos: "",
                  name: name,
                  description: description,
                  public: isPublic,
                  custom: true,
                  isSponsor: false,
                  city: city,
                }),
              }
            )
              .then((response) => response.json())
              .then((data) => console.log(data))
              .then(navigation.navigate("MyTrips"));
          }}
        >
          Save my road
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title:{
    fontFamily: 'Inter_500Medium',
    fontSize: 24,
  },
  name: {
    width: "90%",
    marginTop: "5%",
  },
  description: {
    width: "90%",
    marginTop: "5%",
  },
  switch: {
    width: "90%",
    marginTop: "5%",
  },
  btnContainer: {
    marginTop: "5%",
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
  },
});
