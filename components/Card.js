import React from 'react'
import { SafeAreaView, View, Text, StyleSheet } from "react-native";

function Card(props) {
  return (
    <SafeAreaView>
        <View style={styles.container}>
            <Text>{props.name}</Text>
        </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#182535",
        margin: 10
    }
})

export default Card