import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

export default function WelcomeScreen() {
  return (
    <SafeAreaView>
      <Text style={styles.container}>Welcome screen</Text>
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
});
