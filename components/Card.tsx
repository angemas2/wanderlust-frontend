import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Button } from 'native-base';
import { useDispatch } from 'react-redux';
import { Proximity, updateAndLikePlaces } from '../reducers/places';
import { onDisLike } from '../reducers/places';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot, faPlay, faXmark } from '@fortawesome/free-solid-svg-icons';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_900Black } from '@expo-google-fonts/dev'; //import fonts


SplashScreen.preventAutoHideAsync();



interface Props {
  card: Proximity;
}


function Card(props: Props) {
  //Font variable
  const [fontsLoaded] = useFonts({
    Inter_900Black,
  });
  //Variable for calling useDispatch
  const dispatch = useDispatch();


  //Function for the 3 buttons on the card.
  const onLike = (obj: Props) => {
    dispatch(updateAndLikePlaces(obj.card));
  };

  const disLike = () => {
    dispatch(onDisLike());
  };

  const onGo = () => {
    console.log('start intinaries');
  };


  //Snippet code to initialize fonts
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


//Variable containing style object
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

