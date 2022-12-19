import React, { useCallback } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { horizontalScale, moderateScale, verticalScale } from '../modules/metrics';
import { useFonts, Inter_400Regular, PlayfairDisplay_800ExtraBold } from '@expo-google-fonts/dev'; //import to handle the Roboto font

type WelcomeScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

SplashScreen.preventAutoHideAsync();

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
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
    <SafeAreaView onLayout={onLayoutRootView} style={styles.container}>
      <ImageBackground
        source={require("../assets/images/background.png")}
        style={styles.imageBackground}
      >
        <ImageBackground
          style={styles.topPart}
          source={require("../assets/images/welcome-top-part.png")}
        />
        <Image
          style={styles.logo}
          source={require("../assets/images/logo.png")}
        />
        <View style={styles.center}>
          <View style={styles.titleContainer}>
            <Text style={{ ...styles.title, color: "white" }}>Wander</Text>
            <Text style={{ ...styles.title, color: "#FFB703" }}>Lust</Text>
          </View>
          <Text style={styles.description}>
            Laissez-vous guider par notre compagnon de voyage et découvrez les
            pépites cachées autour de vous
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.textButton}>Commencer à explorer</Text>
          </TouchableOpacity>
        </View>

        <Image
          style={styles.bottomPart}
          source={require("../assets/images/welcome-bottom-part.png")}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#182535',
  },
  imageBackground: {
    width: horizontalScale(400),
    height: verticalScale(720),
  },
  topPart: {
    width: horizontalScale(400),
    height: verticalScale(330),
    bottom: 50,
    margin: 0,
  },
  logo: {
    width: horizontalScale(200),
    height: verticalScale(250),
    zIndex: 2,
    bottom: 240,
    marginLeft: 115,
  },
  center: {
    width: '90%',
    alignItems: 'center',
    marginLeft: 20,
    bottom: 150,
  },
  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontFamily: 'PlayfairDisplay_800ExtraBold',
  },
  description: {
    fontFamily: 'Inter_400Regular',
    color: '#9EC4DB',
  },
  button: {
    zIndex: 2,
    height: verticalScale(55),
    width: horizontalScale(200),
    backgroundColor: '#FFB703',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    marginTop: 30
  },
  textButton: {
    fontFamily: 'Inter_400Regular',
    color: '#023047',
  },
  bottomPart: {
    width: horizontalScale(400),
    height: verticalScale(330),
    bottom: 110,
    color: '#023047',
  },
});
