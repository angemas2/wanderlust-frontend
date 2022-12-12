import React, {useEffect, useState} from 'react'
import { useContext } from 'react';
import { SafeAreaView, Text, StyleSheet } from "react-native";
import PositionContext from '../utils/context'
import Swipe from 'react-native-swipeable';
import Card from 'react-native-card-stack-swiper';
import CardComponent from './Card'


function ExploreSwipe() {

    const [placesData, setPlacesData] = useState([])
    const [swipeable, setSwipeable] = useState(true);
    //Get the context define in App.tsx
    const positionContext = useContext(PositionContext);
    const url = 
    `http://overpass-api.de/api/interpreter?data=[out:json];node["historic"="monument"](around:5000,${positionContext.latitude},${positionContext.longitude});out body;`;
        fetch(url)
        .then(response => response.json()) 
        .then(data => setPlacesData(data.elements.filter(e => e.tags.name != null)))
        .catch((error) => {
             console.log(error)
            });

            const places = placesData.map((e, i) => {
                return  <CardComponent key={i} name={e.tags.name}/>
            })
  return (
    <SafeAreaView style={styles.container}>
        <Swipe
      onSwipe={() => setSwipeable(false)}
      onRelease={() => setSwipeable(true)}
    >
        {places}
        </Swipe>
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