import React, { useState, useContext, useEffect } from "react";
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
import { UserContext } from "../utils/logincontext";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { ResponseType } from "expo-auth-session";

type LoginScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

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

  type dataProps = {
    //props de la réponse data
    result: boolean;
    error: string;
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
    login("angelique");
    navigation.navigate("TabNavigator", { screen: "Explore" });

    fetch("http://192.168.242.131:19000/users/signin", {
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
        style={{
          width: "100%",
          height: "100%",
          opacity: 0.9,
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Text style={styles.title}>Sign In </Text>
          <Text style={styles.subtitle}>Sign In with email address</Text>

          <Box alignItems="center" style={styles.boxStyle}>
            <Input
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              onChangeText={(value: string) => setUsername(value)}
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
              onChangeText={(value: string) => setPassword(value)}
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

          <Button size={"lg"} rounded={30} w="250px" onPress={handleSubmit}>
            Login
          </Button>
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
