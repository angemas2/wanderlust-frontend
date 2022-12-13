import React from 'react'
import { SafeAreaView, View, Text, StyleSheet, ImageBackground } from "react-native";
import logo from '../assets/images/logowithtext.png'

function Card(props) {
    
  return (
        <View style={styles.container}>
            <View style={styles.img}>
                <ImageBackground source={logo} resizeMode="cover" style={styles.image}>
                </ImageBackground>
            </View>
            {props.card && <Text>{props.card.name}</Text>}
        </View>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 0.35,
        borderRadius: 8,
        shadowRadius: 25,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: {width: 0, height: 0},
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    image: {
        marginTop: 0,
        width: 300,
        height: 100,
        backgroundColor: 'red'
    }
})

export default Card