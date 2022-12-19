import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import ExploreMap from '../components/ExploreMap';
import ExploreSwipe from '../components/ExploreSwipe';
import { useSelector } from 'react-redux';
import Header from '../components/Header';

export default function ExploreScreen() {
  const visible = useSelector((state) => state.places.isSwipeVisible);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      {visible ? (
        <SafeAreaView style={styles.container}>
          <ExploreSwipe />
          <ExploreMap />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          <ExploreMap />
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
