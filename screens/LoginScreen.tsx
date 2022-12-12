import React from "react";
import { SafeAreaView, Text, StyleSheet, Pressable } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

type LoginScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Login screen</Text>
      <Pressable
        onPress={() =>
          navigation.navigate("TabNavigator", { screen: "Explore" })
        }
      >
        <Text>Login</Text>
      </Pressable>
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
