import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import ExploreMap from '../components/ExploreMap';
import ExploreSwipe from '../components/ExploreSwipe';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import { PlaceState } from '../reducers/places'
import { NavigationProp, ParamListBase } from "@react-navigation/native";


//Interface defining the props of the component.
interface Props {
  navigation: NavigationProp<ParamListBase>;
}


//Be able to pass navigation to the child component sot hey can also acces native proprety {navigation}.
const ExploreScreen: React.FC<Props> = ({ navigation }) => {


  //true or false sended from reducer places, used to choose if swipe component is visble or not.
  const visible = useSelector((state: { places: PlaceState }) => state.places.value.isSwipeVisible);

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} title="Create your itinerary !" />
      {visible ? (
        <SafeAreaView style={styles.container}>
          <ExploreSwipe />
          <ExploreMap navigation={navigation} />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          <ExploreMap navigation={navigation} />
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ExploreScreen;