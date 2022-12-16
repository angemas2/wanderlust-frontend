import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Box, Input, Button, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons'; //import icons displayed in form's fields
import { UserContext } from '../utils/logincontext';
import * as SplashScreen from 'expo-splash-screen';

import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_500Medium,
  Inter_300Light,
  Inter_500Medium,
  Inter_400Regular,
  PlayfairDisplay_800ExtraBold,
  Roboto_500Medium,
} from '@expo-google-fonts/dev'; //import to handle the Roboto font

import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { ResponseType } from 'expo-auth-session';

type RegisterScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

SplashScreen.preventAutoHideAsync();

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(''); //display error return by backend on email registration
  const [show, setShow] = useState(false); //allow user to show/hide password when typing it in form's field

  const { user, login } = useContext(UserContext);

  type dataUsersProps = {
    //Datas props
    result: boolean;
    error: string;
  };

  // function to handle the registration of the user
  const handleSubmit = () => {
    fetch('https://wanderlust-backend.vercel.app/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data: dataUsersProps) => {
        if (!data.result) {
          // error message displayed if both fields are empty, verification handled & returned by backend
          setError(data.error);
        } else {
          navigation.navigate('TabNavigator', { screen: 'Explore' });
        }
      });
  };

  //Snippet code to handle registration and connection with Google account
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      '917846904757-l9mj7rm5scepeh5pfil3b1r0ae5164j9.apps.googleusercontent.com',
  });

  const fetchGoogleUserInfo = async (token: any) => {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return await response.json();
  };

  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        const { authentication } = response;
        const accessToken = authentication?.accessToken;
        const user = await fetchGoogleUserInfo(accessToken);
        navigation.navigate('TabNavigator', { screen: 'Explore' });
        setUsername(user.name);
        setEmail(user.email);
        let avatar = user.picture;
        fetch('https://wanderlust-backend.vercel.app/users/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username,
            email: email,
          }),
        })
          .then((response) => response.json())
          .then(() => {
            login(username);
            navigation.navigate('TabNavigator', { screen: 'Explore' });
          });
      }
    })();
  }, [response]);

  // Snippet code to handle registration with Facebook account
  const [fbrequest, fbresponse, fbpromptAsync] = Facebook.useAuthRequest({
    clientId: '987336189307276',
    responseType: ResponseType.Code,
  });

  const fbtoken: string =
    'EAAOBZBh7WaYwBACgvdCUy9qy9QrSeDnqmkK654ex0Am5DUWYKJZBL42FJJLN3qwgXdREzSAVqN1keFS13GWO78dTEW9fT2KyuPuCflMliIxCY1J8DyzHMMvRoZCgUuDb77847B6Mcsm9516yDBPtFWBO2RJADRZBLLZBo2lwSZB7FxlrE3sDI7hKLbJLZCflCREMKHlrRpG3QZDZD';

  const facebookUserInfo = async (token: string) => {
    const response = await fetch(
      `https://graph.facebook.com/v15.0/me?fields=email%2Cfirst_name%2Clast_name%2Cpicture&access_token=${token}`
    );
    return await response.json();
  };

  useEffect(() => {
    (async () => {
      if (fbresponse?.type === 'success') {
        const { code } = fbresponse.params;
        const user = await facebookUserInfo(fbtoken);
        setUsername(user.first_name);
        setEmail(user.email);
        fetch('https://wanderlust-backend.vercel.app/users/facebook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username,
            email: email,
          }),
        })
          .then((response) => response.json())
          .then(() => {
            login(username);
            navigation.navigate('TabNavigator', { screen: 'Explore' });
          });
      }
    })();
  }, [fbresponse]);

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_700Bold,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Roboto_500Medium,
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

  //Rendering of the Registration screen
  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.imageBackground}>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text
              style={{
                ...styles.title,
                fontFamily: 'PlayfairDisplay_800ExtraBold',
              }}>
              INSCRIPTION
            </Text>
            <Text style={styles.subtitle}>
              S'inscrire avec une adresse e-mail
            </Text>
          </View>

          <Box alignItems="center" style={styles.boxStyle}>
            {/*box to contain form's registration fields */}
            <Input
              style={styles.input}
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(value) => setEmail(value)}
              value={email}
              variant="rounded"
              bgColor="#023047"
              opacity="0.5"
              mx="3"
              w="100%"
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="alternate-email" />}
                  size={5}
                  ml="2"
                  color="#8ECAE6"
                />
              }
            />
            <Input
              style={styles.input}
              placeholder="Username"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(value) => setUsername(value)}
              value={username}
              variant="rounded"
              bgColor="#023047"
              opacity="0.5"
              mx="3"
              w="100%"
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="person" />}
                  size={5}
                  ml="2"
                  color="#8ECAE6"
                />
              }
            />
            <Input
              style={styles.input}
              variant="rounded"
              placeholder="Password"
              bgColor="#023047"
              opacity="0.5"
              w="100%"
              type={show ? 'text' : 'password'}
              onChangeText={(value) => setPassword(value)}
              value={password}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name={'lock-outline'} />}
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
                        name={show ? 'visibility' : 'visibility-off'}
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
          </Box>

          {error && <Text style={styles.error}>{error}</Text>}
          <Button style={styles.registerButton} onPress={handleSubmit}>
            S'inscrire
          </Button>
          <Text
            style={styles.registeredText}
            onPress={() => navigation.navigate('Login')}>
            Déjà inscrit ? Appuyez ici
          </Text>

          <View style={styles.midMenu}>
            <View style={styles.line}></View>
            <Text style={styles.connectionOptionsText}>Ou</Text>
            <View style={styles.line}></View>
          </View>

          <View style={styles.socialsButtonsContainer}>
            <TouchableOpacity
              style={styles.googleButton}
              disabled={!request}
              onPress={() => {
                promptAsync();
              }}>
              <Image
                source={require('../assets/images/google_logo.png')}
                style={styles.googleLogo}
              />
              <Text style={styles.googleText}>se connecter avec Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.facebookButton}
              disabled={!fbrequest}
              onPress={() => {
                fbpromptAsync();
              }}>
              <Image
                source={require('../assets/images/facebook_logo.png')}
                style={styles.facebookLogo}
              />
              <Text style={styles.facebookText}>
                se connecter avec Facebook
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Image
          source={require('../assets/images/logowithtext.png')}
          style={styles.logo}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#182535',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
    height: '90%',
    marginTop: 60,
  },
  titleContainer: {
    top: 50,
  },
  title: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
  },
  boxStyle: {
    width: '100%',
    height: '25%',
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 19,
    color: '#9EC4DB',
    opacity: 0.8,
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    opacity: 0.6,
  },
  eyeIcon: {
    right: 15,
  },
  lockIcon: {
    left: 8,
  },
  error: {
    marginBottom: 20,
    color: 'red',
  },
  registerButton: {
    width: '100%',
    height: 40,
    borderRadius: 50,
  },
  registeredText: {
    marginBottom: 10,
    color: 'white',
  },
  midMenu: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  line: {
    height: 1,
    width: '40%',
    borderWidth: 1,
    borderColor: 'white',
  },
  connectionOptionsText: {
    color: 'white',
    fontSize: 18,
  },
  socialsButtonsContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: 'white',
    width: '100%',
    height: 40,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleLogo: {
    marginTop: 8,
    marginRight: 24,
    marginBottom: 8,
    marginLeft: 18,
  },
  googleText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,

    color: 'rgba(0, 0, 0, 0.54)',
  },
  facebookButton: {
    backgroundColor: '#1A77F2',
    width: '100%',
    height: 40,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  facebookLogo: {
    width: 25,
    height: 25,
    marginTop: 8,
    marginRight: 14,
    marginBottom: 8,
    marginLeft: 8,
  },
  facebookText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  logo: {
    width: 200,
    height: 55,
  },
});
