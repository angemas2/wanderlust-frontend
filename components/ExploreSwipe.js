import React, {useEffect, useState} from 'react'
import { useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { FlatList } from 'react-native';
import PositionContext from '../utils/context'
import CardComponent from './Card'
import Swiper from 'react-native-deck-swiper'


function ExploreSwipe() {

    const [placesData, setPlacesData] = useState([])
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
                return  { key: i , name: e.tags.name}
            })
  return (
    <View style={styles.container}>
        <Swiper
        cards={places}
        index={places.i}
        renderCard={(card) => <CardComponent card={card}/>}
        disableTopSwipe
        disableBottomSwipe
        animateOverlayLabelsOpacity
        infinite
        overlayLabels={{
            left: {
                title: 'NOPE',
                style: {
                    label: {
                        backgroundColor: "red",
                        color: "#fff",
                        fontSize: 20
                    },
                    wrapper: {
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                        marginTop: 10,
                        marginLeft: -10
                    }
                }
            },
            right: { 
                title: 'LOVE',
            style: {
                label: {
                    backgroundColor: "#219EBC",
                    color: "#fff",
                    fontSize: 20
                },
                wrapper: {
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    marginTop: 10,
                    marginLeft: 10
                }
            }},
        }}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        height: "50%",
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    }
})

export default ExploreSwipe



