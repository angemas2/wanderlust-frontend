import React, {useEffect, useState, useContext} from 'react'
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import Swiper from 'react-native-deck-swiper'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addNewLike, getDefaultPlaces } from '../reducers/places';
import Card from './Card'
import PositionContext from '../utils/context'


function ExploreSwipe() {


    //Variable for calling useDispatch
    const dispatch = useDispatch()


    //Get the context define in App.tsx
    const positionContext = useContext(PositionContext);


    //Array of places with all information in a certain perimeter
    const [placesData, setPlacesData] = useState([])
    const [ index, setIndex ] = useState(0)


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


    //UseEffet listening to update on placesData, just to make sure that places state will not be empty
    useEffect(() => {
            placesData.map((e, i) => {
                dispatch(getDefaultPlaces({ key: i , name: e.tags.name, latitude: e.lat, longitude: e.lon}))
    })

    },[placesData])
    

    //function to be called when a card get swiped right
    // const onLike = (obj) => {
    //     setIndex(index + 1)
    //      dispatch(addNewLike({obj}))
    // }

   
    const places = useSelector((state) => state.places.proximity);

if(places.length > 0) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Browse our suggestions</Text>
            <Swiper
            cards={places}
            index={index}
            renderCard={(card) => <Card card={card}/>}
            // onSwipedRight={(i)=> console.log(i) }
            disableTopSwipe
            backgroundColor={"transparent"}
            marginTop={10}
            cardVerticalMargin={25}
            cardHorizontalMargin={10}
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
}


const styles = StyleSheet.create({
    container: {
        height: "50%",
    },
    title: {
        marginTop: 0,
        marginLeft: 10,
        fontSize: 14,
        fontFamily: "Montserat",
    }
})


export default ExploreSwipe



