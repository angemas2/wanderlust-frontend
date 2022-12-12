import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

export default function NavScreen() {
  return (
    <SafeAreaView>
      <Text style={styles.container}>Nav screen</Text>
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
