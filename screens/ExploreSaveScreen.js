import React from "react";
import { SafeAreaView, Text, StyleSheet, Pressable, View } from "react-native";
import { useContext, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import MapViewDirections from "react-native-maps-alternatives-directions";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import PositionContext from "../utils/context";
import { Box, Input, Icon, Switch, Button } from 'native-base';


export default function ExploreSaveScreen({route, navigation}) {
    
  const user = useSelector((state) => state.user.value);

  console.log(route.params.idsList)
  console.log(route.params.idsList)
  console.log(route.params.idsList)

  const [city, setCity] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [togle, setTogle] = useState(false)
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
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
            offThumbColor="rose.200" 
            onThumbColor="lime.200"
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
                        viewpointsList: idsList,
                        km: distance,
                        map: duration,
                        photos: "",
                        name: name,
                        description: description,
                        public: true,
                        custom: true,
                        isSponsor: false,
                        city: city,
                      }),
                    }
                    )
                    .then((response) => response.json())
                    .then((data) => console.log(data))
                    .then(navigation.navigate("MyTrips"))
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
    height: '60%',
    justifyContent: "space-between",
    alignItems: 'center',
  },
  name: {
    width: '90%',
  },
  description: {
    width: '90%',
  },
  switch: {
    width: '90%',
  },
  btnContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
  },
});
