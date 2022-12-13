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
        backgroundColor: "red",
        width: 50,
        height:50,
        margin: 3,
      
      
    }
})

export default Card