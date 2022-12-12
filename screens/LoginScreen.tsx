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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
 
  const passwordInput = () => {
    const [show, setShow] = React.useState(false);
  
    const handleClick = () => setShow(!show);
  
    return <Box alignItems="center">
        <Input type={show ? "text" : "password"} 
        w="100%" 
        py="0"
        mx="3" 
        InputRightElement={<Button size="xs" rounded="none" w="100%" h="full" onPress={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>} placeholder="Password" />
      </Box>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      

        <Box alignItems="center" style={styles.boxStyle}>
        <Input
            placeholder="Email"
            autoCapitalize="none"
            textContentType="emailAddress"
            keyboardType="email-address"
            onChangeText={(value) => setEmail(value)}
            value={email}
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

       <Button onPress={() => navigation.navigate("TabNavigator", { screen: "Explore" })}>Login</Button>
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
