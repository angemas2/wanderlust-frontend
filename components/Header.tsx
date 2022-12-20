import React from "react";

import {
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { UserState } from "../reducers/user";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

type HeaderProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function Header({ navigation }: HeaderProps) {
  const user = useSelector((state: { user: UserState }) => state.user.value);
  console.log(user);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            style={styles.avatar}
            source={require("../assets/images/default.jpg")}
          />
        </TouchableOpacity>
        <Text style={styles.username}>{user.username}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "10%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  userContainer: {
    flexDirection: "column",
    width: "40%",
    height: "100%",
    left: 80,
  },
  avatar: {
    width: "40%",
    height: "90%",
    borderRadius: 50,
  },
  username: {
    fontSize: 14,
  },
});
