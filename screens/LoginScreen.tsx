import React, {useState} from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
  TextInput,
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { NativeBaseProvider, Box,Input } from "native-base";



type LoginScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {

const [email,setEmail]=useState("")

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Pressable
        onPress={() =>
          navigation.navigate("TabNavigator", { screen: "Explore" })
        }
      >
        <Text style={styles.text}>Login</Text>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          textContentType="emailAddress"
          keyboardType="email-address"
          onChangeText={(value) => setEmail(value)}
          value={email}
        ></TextInput>
        <Box alignItems="center">
          <Input mx="3" placeholder="Input" w="100%" />
        </Box>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#182535",
  },
  text: {
    color: "white",
  },
  title:{
    color:"white",
    fontSize:50,
    fontWeight:"bold"
  }
  
});
