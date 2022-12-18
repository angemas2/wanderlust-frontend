import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

export default function ExploreDetailsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Explore Details screen</Text>
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
