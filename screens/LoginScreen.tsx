import React, { useState } from "react";
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
    type dataProps = { //props de la réponse data
      result: boolean,
      error: string,
    }

    fetch("http://192.168.1.9:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    }).then(response => response.json())
        .then((data: dataProps) => {
      if (data.result) {
        navigation.navigate("TabNavigator", { screen: "Explore" });
      } else {
        console.log(data.error);
      }
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
        <Box alignItems="center" style={styles.boxStyle}>
        <Input
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(value) => setUsername(value)}
            value={username}
            mx="3"
            w="100%"
          />
          <Input 
          placeholder="Password" 
          w="100%"
          type={show ? "text" : "password"}
          onChangeText={(value) => setPassword(value)}
          value={password}  
          InputRightElement={<Pressable onPress={() => setShow(!show)}>
          <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
          </Pressable>} />
        </Box>

       <Button onPress={handleSubmit}>Login</Button>
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
    width: "50%",
    marginBottom: 50,
  },
});
