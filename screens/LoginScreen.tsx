import React, { Component, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Box, Input, Button, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";


type LoginScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

  export default function LoginScreen({ navigation }: LoginScreenProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const [show, setShow] = useState(false);
   
    const handleSubmit = () => { //props de la réponse data
      type dataProps = { 
        result: boolean;
        error: string;
      }

      fetch("http://192.168.1.9:3000/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      })
        .then((response) => response.json())
        .then((data: dataProps) => {
          if (!data.result) { // error returned from the backend if fields are empty or user's details incorrect
          setError(data.error);
          } else { // if user's details are correct, rerouting to ExploreScreen
            navigation.navigate("TabNavigator", { screen: "Explore" }); 
          }
        });
    };

    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require("../assets/images/background.png")} style={styles.imageBackground}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.subtitle}>Connexion avec adresse e-mail</Text>
            
            <Box alignItems="center" style={styles.boxStyle}>
            <Input
              color="white"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(value) => setEmail(value)}
              value={email}
              mx="3"
              w="100%"
              />
            <Input 
              color="white"
              placeholder="Password" 
              w="100%"
              type={show ? "text" : "password"}
              onChangeText={(value) => setPassword(value)}
              value={password}  
              InputRightElement={<Pressable onPress={() => setShow(!show)}>
              <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
              </Pressable>} />
            </Box>

            {error && <Text style={styles.error}>{error}</Text>}
            
            <Button onPress={handleSubmit}>Se connecter</Button>
            <Text onPress={() => navigation.navigate("Home")}>Pas encore inscrit ? Appuyez ici</Text>


            <Image source={require("../assets/images/logowithtext.png")} style={{ width: 250, height: 50, top: 270 }} />
          </View>
         </ImageBackground>
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
    imageBackground: {
      width: "100%",
      height: "100%",
      opacity: 0.9,
    },
    contentContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
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
      marginTop:10,
      marginBottom:20,
    },
    error: {
      marginBottom: 10,
      color: 'red',
    },
  });
