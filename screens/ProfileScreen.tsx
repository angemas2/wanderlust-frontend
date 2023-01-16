import { useState, useCallback } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Box, Input, Button, Icon } from "native-base";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { UserState } from "../reducers/user";

import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_500Medium,
  Inter_300Light,
  Inter_400Regular,
  PlayfairDisplay_800ExtraBold,
  PlayfairDisplay_400Regular,
} from "@expo-google-fonts/dev";

SplashScreen.preventAutoHideAsync();

export default function ProfileScreen() {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [testNewPassword, setTestNewPassword] = useState<string>("");
  const [resultMessage, setResultMessage] = useState<string>("");
  const [passwordModified, setPasswordModified] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  const user = useSelector((state: { user: UserState }) => state.user.value);
  const avatar = user.picture
    ? user.picture
    : "https://res.cloudinary.com/donutkh1m/image/upload/v1671476791/WanderLust/default_ph2ga6.jpg";
  const userToken = user.token;

  type userData = {
    result: boolean;
    error: string;
    data: {
      _id: string;
      email: string;
      username: string;
      password: string;
      token: string;
      registetrationBy: string;
      profile_id: {
        _id: string;
        picture: string;
        location: string;
        name: string;
        firstName: string;
        activities_id: string;
        bio: string;
        preferences: {
          id: string;
          weight: number;
          liked: boolean;
        };
        badge_id: string;
      };
    };
  };

  /* The following snippet code was supposed to be used
  to allow user to edit all of the informations in his profile.
  This functionality has not been more developed due to a 
  lack of time and focused was put on changing password feature
  --------------------------------------------------
  useEffect(() => {
    fetch(`https://wanderlust-backend.vercel.app/users/${user.profile_id}`)
      .then((response) => response.json())
      .then((userData: userData) => {
        if (!userData.result) {
          console.log(userData.error);
        } else {
          const User = userData.data;
          setEmail(User.email);
          setUsername(User.username);
        }
      });
  }, []);
  */

  const handlePasswordSubmit = () => {
    if (newPassword !== testNewPassword) {
      setResultMessage(
        "New password doesn't match in both fields. Please verify your typing"
      );
    } else {
      fetch(
        `https://wanderlust-backend.vercel.app/users/changePassword/${userToken}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword,
            testNewPassword: testNewPassword,
          }),
        }
      )
        .then((response) => response.json())
        .then((data: userData) => {
          if (!data.result) {
            setResultMessage(data.error);
            setPasswordModified(false);
          } else {
            setResultMessage("Your password has been changed");
            setPasswordModified(true);
          }
        });
    }
  };

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_700Bold,
    Inter_300Light,
    Inter_400Regular,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-150}
      onLayout={onLayoutRootView}
    >
      <ImageBackground
        source={require("../assets/images/background.png")}
        style={styles.imageBackground}
      >
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Edit your profile</Text>
            <View>
              <Image source={{ uri: avatar }} style={styles.avatar} />
            </View>
            <Text style={styles.subtitle}>{user.username}</Text>
            <Text style={styles.subtitle}>{user.email}</Text>
          </View>

          <Box style={styles.boxStyle}>
            {/*box to contain form's registration fields */}
            <Input
              style={styles.input}
              variant="rounded"
              placeholder="Type current password"
              color="white"
              bgColor="rgba(2, 48, 71, 0.7)"
              mx="3"
              w="100%"
              type={show ? "text" : "password"}
              onChangeText={(value) => setCurrentPassword(value)}
              value={currentPassword}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name={"lock-outline"} />}
                  style={styles.lockIcon}
                  size={5}
                  mr="2"
                  color="#8ECAE6"
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
                    style={styles.eyeIcon}
                    size={5}
                    mr="2"
                    color="#8ECAE6"
                  />
                </Pressable>
              }
            />
            <Input
              style={styles.input}
              variant="rounded"
              placeholder="Type new password"
              color="white"
              bgColor="rgba(2, 48, 71, 0.7)"
              mx="3"
              w="100%"
              type={show ? "text" : "password"}
              onChangeText={(value) => setNewPassword(value)}
              value={newPassword}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name={"lock-outline"} />}
                  style={styles.lockIcon}
                  size={5}
                  mr="2"
                  color="#8ECAE6"
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
                    style={styles.eyeIcon}
                    size={5}
                    mr="2"
                    color="#8ECAE6"
                  />
                </Pressable>
              }
            />
            <Input
              style={styles.input}
              variant="rounded"
              placeholder="Type new password again"
              color="white"
              bgColor="rgba(2, 48, 71, 0.7)"
              mx="3"
              w="100%"
              type={show ? "text" : "password"}
              onChangeText={(value) => setTestNewPassword(value)}
              value={testNewPassword}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name={"lock-outline"} />}
                  style={styles.lockIcon}
                  size={5}
                  mr="2"
                  color="#8ECAE6"
                />
              }
            />
          </Box>
          <Button style={styles.button} onPress={handlePasswordSubmit}>
            Change password
          </Button>

          {resultMessage && (
            <Text
              style={
                passwordModified
                  ? styles.passwordIsModified
                  : styles.passwordNotModified
              }
            >
              {resultMessage}
            </Text>
          )}

          <Image
            source={require("../assets/images/logowithtext.png")}
            style={styles.logo}
          />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#182535",
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  contentContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%",
    height: "90%",
    marginTop: 20,
  },
  titleContainer: {
    height: "65%",
    alignItems: "center",
    marginBottom: -230,
  },
  title: {
    color: "white",
    fontSize: 38,
    fontFamily: "PlayfairDisplay_800ExtraBold",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10,
    borderColor: "white",
    borderWidth: 4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 19,
    color: "#9EC4DB",
    opacity: 0.8,
    marginTop: 10,
    fontFamily: "Inter_400Regular",
  },
  boxStyle: {
    width: "100%",
    height: "23%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  input: {
    fontFamily: "Inter_300Light",
  },
  eyeIcon: {
    right: 15,
  },
  lockIcon: {
    left: 8,
  },
  button: {
    width: "100%",
    height: 45,
    borderRadius: 50,
    fontFamily: "Inter_500Medium",
    marginBottom: -30,
  },
  passwordIsModified: {
    color: "green",
    marginTop: 10,
  },
  passwordNotModified: {
    color: "red",
    marginTop: 10,
  },
  logo: {
    width: 200,
    height: 55,
    top: "14%",
  },
});
