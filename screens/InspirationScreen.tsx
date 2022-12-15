import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ImageBackground,
} from "react-native";
import { Box, Input, Button, Icon } from "native-base";

export default function InspirationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Inspiration screen</Text>
      <View style={styles.routeCont}>
        <ImageBackground
          style={styles.bg}
          source={require("../assets/images/background.png")}
        >
          <View style={styles.desc}>
            <View style={styles.infos}>
              <Text style={styles.title}>Route title</Text>
              <Text style={{ color: "white" }}>by LovelyBarouder</Text>
              <Text style={{ color: "white" }}>Description of the route</Text>
              <Text style={{ color: "white" }}>18km | 8 spots | 2h </Text>
              <Button>
                Follow
              </Button>
            </View>
          </View>
        </ImageBackground>
      </View>
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
  routeCont: {
    marginTop: 20,
    width: "90%",
    height: 183,
  },
  bg: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  infos: {
    display: "flex",
    justifyContent: "center",
    width: "50%",
    height: "100%",
    backgroundColor: "#182535",
    opacity: 0.7,
    paddingLeft: 10,
  },

  desc: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    height: "100%",
  },
});
