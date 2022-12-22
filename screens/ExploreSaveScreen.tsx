import React, { useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, Switch } from "react-native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Input, Button } from "native-base";
import { resetLike } from '../reducers/places';

interface ExploreSaveScreenProps {
  route: any;
  navigation: any;
}

const ExploreSaveScreen: React.FC<ExploreSaveScreenProps> = ({ route, navigation }) => {
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user.value);
  console.log(route.params.idsList)
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const toggleSwitch = () => setIsPublic(!isPublic);

  console.log("idslist", route.params.idsList);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Remember your adventure</Text>
      <View style={styles.name}>
        <Text>City</Text>
        <Input
          onChangeText={(value: string) => setCity(value)}
          value={city}
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
          onChangeText={(value: string) => setName(value)}
          value={name}
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
          onChangeText={(value: string) => setDescription(value)}
          value={description}
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
          onValueChange={(e: any) => {
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
                method: "Post",
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
              .then(
                navigation.navigate("MyTrips")
              );
            dispatch(resetLike())
          }}
        >
          Save my road
        </Button>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
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

export default ExploreSaveScreen
