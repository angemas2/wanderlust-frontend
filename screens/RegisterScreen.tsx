import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Box, Input, Button, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

type RegisterScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

  export default function RegisterScreen({ navigation }: RegisterScreenProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emptyField, setEmptyField] = useState(false);
    const [show, setShow] = useState(false);
   
    const handleSubmit = () => { //props de la réponse data
      type dataProps = { 
        result: boolean;
        error: string;
      }

      fetch("http://192.168.1.9:3000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            username: username, 
            email: email, 
            password: password
         }),
      }).then(response => response.json())
          .then((data: dataProps) => {
        if (data.result === false) {  // error message displayed if both fields are empty
          setEmptyField(true);
        } else if(data.result) {
          navigation.navigate("TabNavigator", { screen: "Explore" });
        }
      });
    }
  
    return (
      <SafeAreaView style={styles.container}>
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

        {emptyField && <Text style={styles.error}>Champs manquants</Text>}
        <Button onPress={handleSubmit}>S'inscrire</Button>

         <Text onPress={() => navigation.navigate("Login")}>Déjà inscrit ? Appuyez ici</Text>
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
    error: {
      marginBottom: 10,
      color: 'red',
    },
  });
