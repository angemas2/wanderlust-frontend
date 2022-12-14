import React, { useState, useContext, useEffect, Component } from "react";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Box, Input, Button, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { UserContext } from "../utils/logincontext";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { ResponseType } from "expo-auth-session";

type LoginScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  type dataProps = {
    result: boolean;
    error: string;
  };

  const { user, login } = useContext(UserContext);

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
        let username = user.first_name;
        let email = user.email;
        navigation.navigate("TabNavigator", { screen: "Explore" });
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
        let username = user.name;
        let email = user.email;
        let avatar = user.picture;
        console.log(user);
        login(user.name);
        /*fetch("http://192.168.242.131:19000/users/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username }),
        })
          .then((response) => response.json())
          .then((data: dataProps) => {
            if (data.result) {
              navigation.navigate("TabNavigator", { screen: "Explore" });
            } else {
              console.log(data.error);
            }
          });*/
      }
    })();
  }, [response]);

  const handleSubmit = () => {
    fetch("http://192.168.1.9:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.json())
      .then((data: dataProps) => {
        if (!data.result) {
          // error returned from the backend if fields are empty or user's details incorrect
          setError(data.error);
        } else {
          // if user's details are correct, rerouting to ExploreScreen
          navigation.navigate("TabNavigator", { screen: "Explore" });
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/background.png")}
        style={styles.imageBackground}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Connexion avec adresse e-mail</Text>

          <Box alignItems="center" style={styles.boxStyle}>
            <Input
              color="white"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(value: string) => setEmail(value)}
              value={email}
              mx="3"
              w="100%"
            />
            <Input
              color="white"
              placeholder="Password"
              w="100%"
              type={show ? "text" : "password"}
              onChangeText={(value: string) => setPassword(value)}
              value={password}
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

          {error && <Text style={styles.error}>{error}</Text>}

          <Button onPress={handleSubmit}>Se connecter</Button>
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
          <Text onPress={() => navigation.navigate("Home")}>
            Pas encore inscrit ? Appuyez ici
          </Text>
          <Image
            source={require("../assets/images/logowithtext.png")}
            style={{ width: 250, height: 50, top: 270 }}
          />
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
    marginTop: 10,
    marginBottom: 20,
  },
  error: {
    marginBottom: 10,
    color: "red",
  },
});
