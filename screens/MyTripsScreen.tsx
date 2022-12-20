import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  View,
  useWindowDimensions,
  ImageBackground,
  ScrollView,
} from 'react-native';
import TopTabNav from '../components/TopTabNav';
import { useSelector } from 'react-redux';
import { UserState } from '../reducers/user';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

type NavigationScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function MyTripsScreen({ navigation }: NavigationScreenProps) {
  const user = useSelector((state: { user: UserState }) => state.user.value);
  const [trips, setTrips] = useState([]);
  const [followedTrips, setFollowedTrips] = useState([]);

  useEffect(() => {
    fetch(`https://wanderlust-backend.vercel.app/itineraries/profile/${user.profile_id}`)
      .then((response) => response.json())
      .then((data) => {
        setTrips(data.data);
      });
  }, [trips]);

  const tripList = trips.map((data: any, i) => {
    return (
      <View style={styles.tripCont} key={i}>
        <Pressable
          onPress={() => {
            navigation.navigate('ItinerarySummary', { ...data });
          }}>
          <ImageBackground
            imageStyle={{ opacity: 0.3 }}
            source={{ uri: data.viewpoints_id[0]?.photos }}
            style={styles.imgBg}>
            <View
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.tripTitle}>{data.name}</Text>
              <View style={styles.itineraryDatas}>
                <Text style={{ color: 'white' }}>
                  {data.km.toFixed(2)} km | {data.viewpoints_id.length} spots
                </Text>
              </View>
            </View>
          </ImageBackground>
        </Pressable>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <TopTabNav navigation={navigation} />
      <Text> My custom Trips</Text>
      <ScrollView contentContainerStyle={styles.scrollviewContainer}>
        <View style={styles.scrollview}>{tripList}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
const layout = useWindowDimensions();

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    flex: 1,
  },
  scrollviewContainer: {
    paddingBottom: 60,
  },
  scrollview: {},
  tripCont: {
    width: '90%',
    height: 200,
    marginTop: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 48, 71, 0.8)',
    borderRadius: 15,
  },
  imgBg: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '90%',
    color: 'white',
  },
  itineraryDatas: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 40,
  },
  tabView: {
    marginTop: 50,
  },
});
