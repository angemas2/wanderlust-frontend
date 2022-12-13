import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
  TextInput,
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Box, Input, Button, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";


type LoginScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = () => {
    type dataProps = {
      //props de la réponse data
      result: boolean;
      error: string;
    };

    fetch("http://192.168.1.9:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => response.json())
      .then((data: dataProps) => {
        if (data.result) {
          navigation.navigate("TabNavigator", { screen: "Explore" });
        } else {
          console.log(data.error);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/background.png")}
        style={{ width: "100%", height: "100%", opacity: 0.6 }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#182535",
          }}
        >
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Sign In with email address</Text>

          <Box alignItems="center" style={styles.boxStyle}>
            <Input
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              onChangeText={(value) => setUsername(value)}
              value={username}
              mx="auto"
              w="250px"
              marginTop={8}
              color={"#FFF"}
              variant="rounded"
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="person" />}
                  size={5}
                  ml="4"
                  color="muted.500"
                />
              }
            />
            <Input
              placeholder="Password"
              w="250px"
              marginTop={8}
              variant="rounded"
              color={"#FFF"}
              type={show ? "text" : "password"}
              onChangeText={(value) => setPassword(value)}
              value={password}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="vpn-key" />}
                  size={5}
                  ml="4"
                  color="muted.500"
                />
              }
              InputRightElement={
                <Pressable onPress={() => setShow(!show)}>
                  <Icon
                    as={
                      <MaterialIcons
                        name={show ? "visibility" : "visibility-off"}
                      />
                    }
                    size={5}
                    mr="2"
                    color="muted.400"
                  />
                </Pressable>
              }
            />
          </Box>

          <Button size={"lg"} rounded={30} w="250px" onPress={navigation.navigate("TabNavigator", { screen: "Explore" })}>
            Login
          </Button>
        </View>
      </ImageBackground>
      <Image
        source={require("../assets/images/logowithtext.png")}
        style={{ width: 250, height: 50, marginBottom: 40 }}
      ></Image>
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
  title: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
  },
  boxStyle: {
    width: "100%",
    marginBottom: 50,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 19,
    color: "#9EC4DB",
    opacity: 0.8,
    marginTop: 10,
    marginBottom: 20,
  },
});
