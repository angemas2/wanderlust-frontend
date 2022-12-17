import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ImageBackground,
} from "react-native";
import { useSelector } from "react-redux";
import { UserState } from "../reducers/user";

export default function MyTripsScreen() {
  const user = useSelector((state: { user: UserState }) => state.user.value);
  const [trips, setTrips] = useState([]);

  console.log(user.profile_id)
  
 useEffect(() => {
   fetch(
     `https://wanderlust-backend.vercel.app/itineraries/profile/${user.profile_id}`
   )
     .then((response) => response.json())
     .then((data) => {
       console.log("data",data.data);
       setTrips(data.data);
     });
 }, []);

  const tripList = trips.map((data:any, i) => {return (
    <View style={styles.tripCont} key={i}>
      <ImageBackground
        source={require("../assets/images/background.png")}
        style={styles.imgBg}
      >
        <Text style={styles.tripTitle}>{data.name}</Text>
      </ImageBackground>
    </View>
  );});

  return (
    <SafeAreaView style={styles.container}>
      <Text>{user.username} Trips</Text>
      <View style={styles.tripCont}>
        <ImageBackground
          source={require("../assets/images/background.png")}
          style={styles.imgBg}
        >
          <Text style={styles.tripTitle}>Trip Name</Text>
        </ImageBackground>
      </View>
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
  },
  imgBg: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  tripTitle:{
    fontSize:30,
    fontWeight:"bold",
  }
});
