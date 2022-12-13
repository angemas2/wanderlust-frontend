import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import ExploreMap from "../components/ExploreMap";
import ExploreSwipe from "../components/ExploreSwipe";

export default function NavScreen() {
  function calcCrow(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d.toFixed(2);
  }

  // Converts numeric degrees to radians
  function toRad(Value: number) {
    return (Value * Math.PI) / 180;
  }

  return (
    <SafeAreaView style={styles.container}>
     <ExploreMap/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
