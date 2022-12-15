import React from 'react'
import { SafeAreaView,Image, View, Text, StyleSheet, ImageBackground } from "react-native";
import logo from '../assets/images/logowithtext.png'
import { Box, Input, Button, Icon } from "native-base";
import { useDispatch } from 'react-redux';
import { updateAndLikePlaces } from '../reducers/places';
import { onDisLike } from '../reducers/places';
import monument from '../assets/images/monument.png'

function Card(props) {


        
    //Variable for calling useDispatch
    const dispatch = useDispatch()


    const onLike = (obj) => {
        dispatch(updateAndLikePlaces(obj))
    }
    const disLike = () => {
        dispatch(onDisLike())
    }
    const onGo = () => {
        console.log("start intinaries")
    }


    return (
            <View style={styles.container}>
                  <ImageBackground source={monument} resizeMode="cover" style={styles.image}>
                {props.card && <Text style={styles.text}>{props.card.name}</Text>}
                <View style={styles.btnContainer}>
                <Button 
                style={styles.button}
                onPress={() => onLike(props)}
                >
                    ❤️ </Button>
                    <Button 
                style={styles.button}
                onPress={() => onGo()}
                >
                    ⬆️</Button>
                <Button 
                style={styles.button}
                onPress={() => disLike()}
                >
                    ❌</Button>
                </View>
                </ImageBackground>
            </View>
  )
}
const styles = StyleSheet.create({
    container: {
        height: '40%',
        shadowRadius: 25,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: {width: 0, height: 0},
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: "red"
    },  
    image: {
        justifyContent: 'space-around',
        alignItems: 'center',
        height: "100%",
        width: "100%",
    },
    text: {
        fontSize: 16,
        color: '#000'
    },
    button: {
        borderRadius: 100,        
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-around",
        width: "100%",
    }
})

export default Card