import React from "react";
import {Image, ImageBackground, SafeAreaView, Text, StyleSheet, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require("../assets/images/background.png")} style={styles.imageBackground}>
        <View style={styles.topDecorationContainer}>
          <View style={styles.topRightContainer}/>
            <View style={styles.topCenterContainer}/>
              <View style={styles.topLeftContainer}/>
        </View>
        <Image source={require("../assets/images/logo.png")} style={styles.logo}/>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#182535",
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  topDecorationContainer: {
    height: 260,
    width: "100%",
    backgroundColor: "blue",
  },
  topRightContainer: {
    padding: 5,
    width: 1/3,
  },
  topCenterContainer: {
    width: 1/3,
    padding: 3,
  },
  topLeftContainer: {

  },
  logo: {
    zIndex: 2,
  },
});
