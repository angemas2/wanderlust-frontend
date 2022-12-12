import React from 'react'
import { useContext } from 'react';
import { SafeAreaView, Text, StyleSheet } from "react-native";
import PositionContext from '../utils/context'
import axios from 'axios';


function ExploreSwipe() {

    //Get the context define in App.tsx
    const positionContext = useContext(PositionContext);
    const queryUrl = `http://overpass-api.de/api/interpreter?data=[out:json];node["historic"="monument"](around:5000,${positionContext.latitude},${positionContext.longitude});out body;`;

    fetch(queryUrl)
    .then(response => response.json())
    .then(data => console.log(data))
  .catch((error) => {
         console.log(error)
        });

  return (
    <SafeAreaView style={styles.container}>
        <Text>Swipe</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        height: "50%",
        width: "100%",
    }
})

export default ExploreSwipe