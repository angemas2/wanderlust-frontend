import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  View,
  useWindowDimensions,
  ImageBackground,
} from "react-native";
import { useSelector } from "react-redux";
import { UserState } from "../reducers/user";
import { NavigationProp, ParamListBase } from "@react-navigation/native";


type NavigationScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function MyTripsScreen({ navigation }: NavigationScreenProps) {
  const user = useSelector((state: { user: UserState }) => state.user.value);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetch(
      `https://wanderlust-backend.vercel.app/itineraries/profile/${user.profile_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setTrips(data.data);
      });
  }, [trips]);

  const tripList = trips.map((data: any, i) => {
    return (
      <View style={styles.tripCont} key={i}>
        <Pressable>
          <ImageBackground
            imageStyle={{ opacity: 0.3 }}
            source={{ uri: data.viewpoints_id[0]?.photos }}
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
              <Text style={styles.tripTitle}>{data.name}</Text>
              <View style={styles.itineraryDatas}>
                <Text style={{ color: "white" }}>
                  {data.km.toFixed(2)} km | {data.viewpoints_id.length} spots
                </Text>
              </View>
            </View>
          </ImageBackground>
        </Pressable>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text>{user.profile_id} Trips</Text>
      {tripList}
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
  tripCont: {
    width: "90%",
    height: 200,
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(2, 48, 71, 0.8)",
  },
  imgBg: {
    display: "flex",
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
});
