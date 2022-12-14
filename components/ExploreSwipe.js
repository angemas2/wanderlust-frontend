import React, {useEffect, useState, useContext} from 'react'
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import Swiper from 'react-native-deck-swiper'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addNewPlace } from '../reducers/places';
import CardComponent from './Card'
import PositionContext from '../utils/context'


function ExploreSwipe() {


    //Variable for calling useDispatch
    const dispatch = useDispatch()


    //Get the context define in App.tsx
    const positionContext = useContext(PositionContext);


    //Array of places with all information in a certain perimeter
    const [placesData, setPlacesData] = useState([])
    //Array within object that contain each information of placesData that are needed
    const places = []


    //Request to get places in a certain perimeter
    useEffect(() => {
        const url = `http://overpass-api.de/api/interpreter?data=[out:json];node["historic"="monument"](around:5000,${positionContext.latitude},${positionContext.longitude});out body;`;
        fetch(url)
        .then(response => response.json()) 
        .then(data => {
            setPlacesData(data.elements.filter(e => e.tags.name != null))
        })
        .catch((error) => {
                console.log(error)
                });
    }, [])


    //UseEffet listening to update oon placesData, just to make sure that places state will not be empty
    useEffect(() => {
        placesData.map((e, i) => {
            places.push({ key: i , name: e.tags.name, latitude: e.lat, longitude: e.lon})
           })
           console.log(places)
    },[placesData])
    

    //function to be called when a card get swiped right
    const onLike = (lat, long) => {
        dispatch(addNewPlace({latitude: lat, longitude: long}))
    }


    const test = useSelector((state) => state.places.value);
    console.log(test)

  return (
    <View style={styles.container}>
        <Swiper
        cards={places}
        index={places.i}
        renderCard={(card) => <CardComponent card={card}/>}
        onSwipedRight={(i)=> dispatch(addNewPlace({latitude:  places[i].latitude, longitude: places[i].longitude}))}
        disableTopSwipe
        disableBottomSwipe
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
    },
    wrapper: {
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        marginTop: 10,
        marginLeft: -10
    }
})


export default ExploreSwipe



