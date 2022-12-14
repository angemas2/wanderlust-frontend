import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../reducers/user';

import {
  Platform,
  KeyboardAvoidingView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Box, Input, Button, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { ResponseType } from 'expo-auth-session';

import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_500Medium,
  Inter_300Light,
  Inter_500Medium,
  Inter_400Regular,
  PlayfairDisplay_800ExtraBold,
  PlayfairDisplay_400Regular,
  Roboto_500Medium,
} from '@expo-google-fonts/dev'; //import fonts

type LoginScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

SplashScreen.preventAutoHideAsync();

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();

  type dataProps = {
    result: boolean;
    error: string;
    username: string;
    email: string;
    token: string;
    profile_id: {
      _id: string;
      picture: string;
    };
    ID_PROFIL: string;
  };

  //Snippet code to handle registration and connection with Google account
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '917846904757-l9mj7rm5scepeh5pfil3b1r0ae5164j9.apps.googleusercontent.com',
  });

  const fetchGoogleUserInfo = async (token: any) => {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  };

  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        const { authentication } = response;
        const accessToken = authentication?.accessToken;
        fetchGoogleUserInfo(accessToken).then(async (userData) => {
          const postData = fetch('https://wanderlust-backend.vercel.app/users/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: userData.name,
              email: userData.email,
              picture: userData.picture,
              google_id: userData.sub,
            }),
          });

          const data = (await postData).json();

          const userDataFromAPI: dataProps = await data;

          const { profile_id } = userDataFromAPI;
          dispatch(
            updateUserProfile({
              username: userDataFromAPI.username,
              email: userDataFromAPI.email,
              picture: userDataFromAPI.profile_id.picture,
              profile_id: userDataFromAPI.profile_id._id,
              token: userDataFromAPI.token,
            })
          );
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

  const fbtoken: any = process.env.FACEBOOK_TOKEN;

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

        fetch('https://wanderlust-backend.vercel.app/users/facebook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user.first_name,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            picture: user.picture.data.url,
            facebook_id: user.id,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            dispatch(
              updateUserProfile({
                email: user.email,
                username: user.first_name,
                picture: user.picture.data.url,
                profile_id: data.profile_id._id,
                token: data.token,
              })
            );
            navigation.navigate('TabNavigator', { screen: 'Explore' });
          });
      }
    })();
  }, [fbresponse]);

  const handleSubmit = () => {
    fetch('https://wanderlust-backend.vercel.app/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.json())
      .then((data: dataProps) => {
        if (!data.result) {
          // error returned from the backend if fields are empty or user's details incorrect
          setError(data.error);
        } else {
          // if user's details are correct, dispatching them and rerouting user to ExploreScreen
          dispatch(
            updateUserProfile({
              email: data.email,
              username: data.username,
              picture: data.profile_id.picture,
              profile_id: data.profile_id._id,
              token: data.token,
            })
          );
          navigation.navigate('TabNavigator', { screen: 'Explore' });
        }
      });
  };

  //snippet code to initialize fonts
  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_700Bold,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Roboto_500Medium,
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={-200}
      onLayout={onLayoutRootView}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.imageBackground}>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>LOGIN</Text>
            <Text style={styles.subtitle}>Login with email adress</Text>
          </View>

          <Box alignItems="center" style={styles.boxStyle}>
            {/*box to contain form's registration fields */}
            <Input
              style={styles.input}
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(value) => setEmail(value)}
              value={email}
              variant="rounded"
              color="white"
              bgColor="rgba(2, 48, 71, 0.7)"
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
              variant="rounded"
              placeholder="Password"
              color="white"
              bgColor="rgba(2, 48, 71, 0.7)"
              mx="3"
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
                    as={<MaterialIcons name={show ? 'visibility' : 'visibility-off'} />}
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
            Connect
          </Button>
          <View style={styles.registeredTextContainer}>
            <Text style={styles.registeredText}>Not registered yet?</Text>
            <Text style={styles.pushHere} onPress={() => navigation.navigate('Register')}>
              Push here
            </Text>
          </View>
          <View style={styles.midMenu}>
            <View style={styles.line}></View>
            <Text style={styles.connectionOptionsText}>Or</Text>
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
              <Text style={styles.googleText}>Sign in with Google</Text>
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
              <Text style={styles.facebookText}>Sign in with Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Image source={require('../assets/images/logowithtext.png')} style={styles.logo} />
      </ImageBackground>
    </KeyboardAvoidingView>
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
    marginTop: 20,
  },
  titleContainer: {
    marginTop: 20,
    right: '15%',
  },
  title: {
    color: 'white',
    fontSize: 38,
    fontFamily: 'PlayfairDisplay_800ExtraBold',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 19,
    color: '#9EC4DB',
    opacity: 0.8,
    marginTop: 10,
    fontFamily: 'Inter_400Regular',
  },
  boxStyle: {
    width: '100%',
    height: '15%',
    justifyContent: 'space-between',
    marginBottom: -60,
  },
  input: {
    fontFamily: 'Inter_300Light',
  },
  eyeIcon: {
    right: 15,
  },
  lockIcon: {
    left: 8,
  },
  error: {
    color: 'red',
  },
  registerButton: {
    width: '100%',
    height: 45,
    borderRadius: 50,
    fontFamily: 'Inter_500Medium',
    marginBottom: -55,
  },
  registeredTextContainer: {
    flexDirection: 'row',
    marginBottom: -55,
  },
  registeredText: {
    color: 'white',
    fontFamily: 'Montserrat_500Medium',
    marginBottom: -35,
    marginRight: 10,
  },
  pushHere: {
    fontFamily: 'Montserrat_700Bold',
    color: 'white',
  },
  midMenu: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -50,
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
    marginRight: 20,
    marginBottom: 8,
    marginLeft: 13,
  },
  facebookText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Montserrat_500Medium',
  },
  logo: {
    width: 200,
    height: 55,
    marginTop: 20,
  },
});
