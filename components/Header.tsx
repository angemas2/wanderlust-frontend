import { useCallback } from 'react';
import { SafeAreaView, Text, StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { UserState } from '../reducers/user';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_500Medium } from '@expo-google-fonts/dev'; //import fonts

type HeaderProps = {
  navigation: NavigationProp<ParamListBase>;
};

SplashScreen.preventAutoHideAsync();

export default function Header({ navigation, title }: HeaderProps & { title: string }) {
  const user = useSelector((state: { user: UserState }) => state.user.value);

  const avatar = user.picture;

  const [fontsLoaded] = useFonts({
    Inter_500Medium,
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
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <Image source={require('../assets/images/logo-header.png')} style={styles.logo} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.userContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image style={styles.avatar} source={{ uri: avatar }} />
        </TouchableOpacity>
        <Text style={styles.username}>{user.username}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "10%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: "10%",
  },
  logo: {
    aspectRatio: 1,
    width: 200,
    right: "40%",
    bottom: "35%",
  },
  title: {
    fontFamily: "Inter_500Medium",
    fontSize: 20,
    textAlign: "center",
    right: "80%",
    width: 150,
    color: "#023047",
  },
  userContainer: {
    display: "flex",
    flexDirection: "column",
    width: "18%",
    height: "100%",
  },
  avatar: {
    aspectRatio: 1,
    borderRadius: 100,
    maxHeight: 50,
  },
  username: {
    fontSize: 10,
    textAlign: "center",
    width: "70%",
    color: "#023047",
    opacity:0.5,
  },
});
