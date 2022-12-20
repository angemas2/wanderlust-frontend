import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import ExploreMap from '../components/ExploreMap';
import ExploreSwipe from '../components/ExploreSwipe';
import { useSelector } from 'react-redux';
import Header from '../components/Header';

export default function ExploreScreen({navigation}) {
  const visible = useSelector((state) => state.places.isSwipeVisible);

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} title="Explore" />
      {visible ? (
        <SafeAreaView style={styles.container}>
          <ExploreSwipe />
          <ExploreMap navigation={navigation}/>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          <ExploreMap navigation={navigation}/>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
  },
});
