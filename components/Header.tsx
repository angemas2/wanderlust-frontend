import React from 'react'

import { SafeAreaView, Text, StyleSheet } from "react-native";



function Header(title:string) {

  
  return (
    <SafeAreaView style={styles.container}>
        <Text>{title}</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        height: 30,
        width: "100%",
    }
})

export default Header