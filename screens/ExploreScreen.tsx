import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import ExploreMap from "../components/ExploreMap"
import ExploreSwipe from "../components/ExploreSwipe"

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ExploreSwipe />
      <ExploreMap />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
