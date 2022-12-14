import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import ExploreMap from "../components/ExploreMap";
import ExploreSwipe from "../components/ExploreSwipe";
import { UserContext } from "../utils/logincontext";
import { useContext } from "react";

export default function ExploreScreen() {
  const { user } = useContext(UserContext);
  return (
    <SafeAreaView style={styles.container}>
      <Text>{user.username}</Text>
      <ExploreSwipe />
      <ExploreMap />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%"
  },
});
