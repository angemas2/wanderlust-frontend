import React from 'react'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import PositionContext from '../utils/context'
import { useSelector } from 'react-redux';

function ExploreMap() {


    //Get the context define in App.tsx
    const positionContext = useContext(PositionContext);


    const likedPlace = useSelector((state) => state.places.liked);


    const point = likedPlace.map((e, i) => {
        return <Marker key={i} title={e.card.name} coordinate={{latitude: e.card.latitude, longitude: e.card.longitude}} />
    })


  return (
    <View style={styles.container}>
        <Text style={styles.title}>My adventure</Text>
        <MapView
            mapType="hybrid"
            initialRegion={{
            latitude: positionContext.latitude,
            longitude: positionContext.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }}
            style={styles.map}
            >
                <Marker coordinate={{ latitude: positionContext.latitude, longitude: positionContext.longitude }} />
                {point}
        </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        height: "50%",
        width: "100%",
    },
    map: {
        height: "80%",
        width: "95%",
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },
    title: {
        marginTop: 0,
        marginLeft: 10,
        fontSize: 14,
        fontFamily: "Montserat",
    }
})

export default ExploreMap