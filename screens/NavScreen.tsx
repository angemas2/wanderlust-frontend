import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

export default function NavScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Nav screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent:"center",
  },
});
