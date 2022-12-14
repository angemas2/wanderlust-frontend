import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  View,
  Image
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Box, Input, Button, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { UserContext } from "../utils/logincontext";

import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { ResponseType } from "expo-auth-session";

type RegisterScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

  export default function RegisterScreen({ navigation }: RegisterScreenProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registrationBy, setRegistrationBy] = useState("")
    const [error, setError] = useState("")
    const [show, setShow] = useState(false);
    
    const { user, login } = useContext(UserContext);
   
    type dataProps = { 
      result: boolean;
      error: string;
    }

    const handleSubmit = () => { //props de la réponse data
      setRegistrationBy("email");

      fetch("http://192.168.1.9:3000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            username: username, 
            email: email, 
            password: password,
            registrationBy: registrationBy,
         }),
      }).then(response => response.json())
          .then((data: dataProps) => {
            console.log(registrationBy);
        if (!data.result) {  // error message displayed if both fields are empty
          setError(data.error);
        } else if(data.result) {
          navigation.navigate("TabNavigator", { screen: "Explore" });
        }
        
      });
    }

    const [request, response, promptAsync] = Google.useAuthRequest({
      expoClientId:
        "917846904757-l9mj7rm5scepeh5pfil3b1r0ae5164j9.apps.googleusercontent.com",
    });
  
    const [fbrequest, fbresponse, fbpromptAsync] = Facebook.useAuthRequest({
      clientId: "987336189307276",
      responseType: ResponseType.Code,
    });
  
    const fetchGoogleUserInfo = async (token: any) => {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return await response.json();
    };
  
    const fbtoken: string =
      "EAAOBZBh7WaYwBACgvdCUy9qy9QrSeDnqmkK654ex0Am5DUWYKJZBL42FJJLN3qwgXdREzSAVqN1keFS13GWO78dTEW9fT2KyuPuCflMliIxCY1J8DyzHMMvRoZCgUuDb77847B6Mcsm9516yDBPtFWBO2RJADRZBLLZBo2lwSZB7FxlrE3sDI7hKLbJLZCflCREMKHlrRpG3QZDZD";
  
    const facebookUserInfo = async (token: string) => {
      const response = await fetch(
        `https://graph.facebook.com/v15.0/me?fields=email%2Cfirst_name%2Clast_name%2Cpicture&access_token=${token}`
      );
      return await response.json();
    };
  
    useEffect(() => {
      (async () => {
        if (fbresponse?.type === "success") {
          const { code } = fbresponse.params;
          const user = await facebookUserInfo(fbtoken);
          console.log(user);
          setUsername(user.first_name);
          setEmail(user.email);
          setRegistrationBy("facebook");
          fetch("http://localhost:3000/facebook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              username: username, 
              email: email,
              registrationby: registrationBy
            }),
          })
          .then((response) => response.json())
          .then(() => {
              login(username);
              navigation.navigate("TabNavigator", { screen: "Explore" }); 
          });
        }
      })();
    }, [fbresponse]);
  
    useEffect(() => {
      (async () => {
        if (response?.type === "success") {
          const { authentication } = response;
          const accessToken = authentication?.accessToken;
          const user = await fetchGoogleUserInfo(accessToken);
          navigation.navigate("TabNavigator", { screen: "Explore" });
          setUsername(user.name);
          setEmail(user.email);
          setRegistrationBy("google");
          let avatar = user.picture;
          fetch("http://localhost:3000/facebook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              username: username, 
              email: email,
              registrationBy: registrationBy
            }),
          })
          .then((response) => response.json())
          .then(() => {
              login(username);
              navigation.navigate("TabNavigator", { screen: "Explore" }); 
          });
        }
      })();
    }, [response]);
  
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require("../assets/images/background.png")} style={styles.imageBackground}>
          <View style={styles.contentContainer}>
        <Text style={styles.title}>Inscription</Text>
        
            <Box alignItems="center" style={styles.boxStyle}>
            <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(value) => setEmail(value)}
                value={email}
                mx="3"
                w="100%"
                />
            <Input
              placeholder="Username"
              autoCorrect={false}
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

        {error && <Text style={styles.error}>{error}</Text>}
        <Button onPress={handleSubmit}>S'inscrire</Button>
         <Text onPress={() => navigation.navigate("Login")}>Déjà inscrit ? Appuyez ici</Text>

         <Button
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
          >
            Google
          </Button>
          <Button
            disabled={!fbrequest}
            onPress={() => {
              fbpromptAsync();
            }}
          >
            Facebook
          </Button>

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
