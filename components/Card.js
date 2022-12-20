import React, { useCallback } from 'react';
import { SafeAreaView, Image, View, Text, StyleSheet, ImageBackground } from 'react-native';
import logo from '../assets/images/logowithtext.png';
import { Box, Input, Button, Icon } from 'native-base';
import { useDispatch } from 'react-redux';
import { updateAndLikePlaces } from '../reducers/places';
import { onDisLike } from '../reducers/places';
import monument from '../assets/images/monument.png';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot, faPlay, faXmark } from '@fortawesome/free-solid-svg-icons';

import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_900Black } from '@expo-google-fonts/dev'; //import fonts

SplashScreen.preventAutoHideAsync();

function Card(props) {
  console.log(props.card.photo);
  //Variable for calling useDispatch
  const dispatch = useDispatch();

  const onLike = (obj) => {
    dispatch(updateAndLikePlaces(obj.card));
  };
  const disLike = () => {
    dispatch(onDisLike());
  };
  const onGo = () => {
    console.log('start intinaries');
  };

  const [fontsLoaded] = useFonts({
    Inter_900Black,
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
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: props.card.photo }}
        resizeMode="cover"
        imageStyle={{ opacity: 0.5 }}
        style={styles.image}>
        {props.card && <Text style={styles.text}>{props.card.name}</Text>}
        <View style={styles.btnContainer}>
          <Button style={styles.button} onPress={() => onLike(props)}>
            <FontAwesomeIcon icon={faLocationDot} style={{ color: '#FFB703' }} />
          </Button>
          <Button style={styles.button} onPress={() => onGo()}>
            <FontAwesomeIcon icon={faPlay} style={{ color: '#FFB703' }} />
          </Button>
          <Button style={styles.button} onPress={() => disLike()}>
            <FontAwesomeIcon icon={faXmark} style={{ color: '#FFB703' }} />
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: '32%',
    shadowRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 0 },
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter_900Black',
    color: '#fff',
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#FBBF13',
  },
});

export default Card;
