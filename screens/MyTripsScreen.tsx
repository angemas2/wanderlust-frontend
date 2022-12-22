import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  View,
  useWindowDimensions,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { UserState } from "../reducers/user";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Radio, FlatList, Stack, Icon } from "native-base";
import Header from "../components/Header";
import { MaterialIcons } from "@expo/vector-icons";

type NavigationScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function MyTripsScreen({ navigation }: NavigationScreenProps) {
  const user = useSelector((state: { user: UserState }) => state.user.value);
  const [trips, setTrips] = useState<any[]>();
  const [followedTrips, setFollowedTrips] = useState<any[]>();
  const [routeType, setRouteType] = useState(true);

  useEffect(() => {
    fetch(
      `https://wanderlust-backend.vercel.app/itineraries/profile/${user.profile_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setTrips(data.data);
      });
  }, [trips]);

  useEffect(() => {
    fetch(
      `https://wanderlust-backend.vercel.app/itineraries/followed/${user.profile_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setFollowedTrips(data.data);
      });
  }, [followedTrips]);

  //get trips created by the user
  const FirstRoute = () => (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={trips}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.tripCont}>
          <Pressable
            onPress={() => {
              navigation.navigate("ItinerarySummary", { ...item });
            }}
          >
            <ImageBackground
              imageStyle={{ opacity: 0.3 }}
              blurRadius={2}
              source={{ uri: item.viewpoints_id[0]?.photos }}
              style={styles.imgBg}
            >
              <View
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.tripTitle}>{item.name}</Text>
                <View style={styles.itineraryDatas}>
                  <Text style={{ color: "white" }}>
                    {item.km.toFixed(2)} km | {item.viewpoints_id.length} spots
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        </View>
      )}
    />
  );

  //get existing trips followed by the user

  const SecondRoute = () => (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={followedTrips}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.tripCont}>
          <Pressable
            onPress={() => {
              navigation.navigate("ItinerarySummary", { ...item });
            }}
          >
            <ImageBackground
              imageStyle={{ opacity: 0.3 }}
              blurRadius={2}
              source={{ uri: item.viewpoints_id[0]?.photos }}
              style={styles.imgBg}
            >
              <View
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.tripTitle}>{item.name}</Text>
                <View style={styles.itineraryDatas}>
                  <Text style={{ color: "white" }}>
                    {item.km.toFixed(2)} km | {item.viewpoints_id.length} spots
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        </View>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="My travels" />
      <>
        <Radio.Group
          name="Route types"
          defaultValue="1"
          style={{
            backgroundColor: "#219EBC",
            width: "100%",
            height: "8%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onChange={() => {
            setRouteType(!routeType);
          }}
        >
          <Stack
            direction={{
              base: "row",
              md: "row",
            }}
            alignItems={{
              base: "center",
              md: "center",
            }}
            justifyContent={"center"}
            space={4}
            w="100%"
          >
            <Radio
              value="1"
              size="md"
              my={1}
              icon={<Icon as={<MaterialIcons name="favorite" />} size={5} />}
            >
              <Text style={{ color: "white" }}>Custom</Text>
            </Radio>
            <Radio
              value="2"
              size="md"
              my={1}
              icon={<Icon as={<MaterialIcons name="favorite" />} size={5} />}
            >
              <Text style={{ color: "white" }}>Followed</Text>
            </Radio>
          </Stack>
        </Radio.Group>
      </>
      <ScrollView>{routeType ? FirstRoute() : SecondRoute()}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  scrollviewContainer: {
    flexGrow: 1,
    paddingbottom: 50,
  },
  scrollviewContent: {},
  tripCont: {
    width: "95%",
    height: 200,
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(2, 48, 71, 0.8)",
    borderRadius: 15,
  },
  imgBg: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    width: "90%",
    color: "white",
  },
  itineraryDatas: {
    display: "flex",
    flexDirection: "row",
    marginTop: 40,
  },
  tabView: {
    marginTop: 50,
  },
});
