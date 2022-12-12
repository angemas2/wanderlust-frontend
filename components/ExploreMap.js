import React from 'react'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { useContext } from 'react';
import { SafeAreaView, Text, StyleSheet } from "react-native";
import PositionContext from '../utils/context'

function ExploreMap() {


    //Get the context define in App.tsx
    const positionContext = useContext(PositionContext);


  return (
    <SafeAreaView style={styles.container}>
        <MapView
            initialRegion={{
            latitude: positionContext.latitude,
            longitude: positionContext.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }}
            style={styles.map}
            >
                <Marker coordinate={{ latitude: positionContext.latitude, longitude: positionContext.longitude }} />
        </MapView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        height: "50%",
        width: "100%",
    },
    map: {
        height: "100%",
        width: "100%",
    }
})

export default ExploreMap