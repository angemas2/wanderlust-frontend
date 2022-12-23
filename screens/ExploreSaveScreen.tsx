import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, ImageBackground, Switch } from 'react-native';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { resetLike } from '../reducers/places';
import { Input, Button } from 'native-base';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { UserState } from '../reducers/user';

interface ExploreSaveScreenProps {
  route: any;
  navigation: NavigationProp<ParamListBase>;
}

const ExploreSaveScreen: React.FC<ExploreSaveScreenProps> = ({ route, navigation }) => {
  const user = useSelector((state: { user: UserState }) => state.user.value);
  console.log(route.params.idsList);
  const dispatch = useDispatch();
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const toggleSwitch = () => setIsPublic(!isPublic);

  console.log('idslist', route.params.idsList);

  type itineraryTypes = {
    data: {
      _id: string;
      profile_id: {
        _id: string;
        picture: string;
        location: string;
        name: string;
        firstName: string;
        activities_id: string;
        bio: string;
        preferences: {
          id: string;
          weight: number;
          liked: boolean;
        };
        badge_id: string;
      };
      viewpointsList: {
        _id: string;
        name: string;
        description: string;
        photos?: string[];
        location: {
          latitude: number;
          longitude: number;
        };
        tags_id?: string[];
      };
      km: number;
      map: string;
      photos: string[] | null;
      name: string;
      description: string;
      isPublic: boolean;
      isCustom: boolean;
      rating: number;
      tags: string[] | null;
      isSponsor: boolean;
      city: string;
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.imageBackground}>
        <Text style={styles.title}>Remember your adventure !</Text>
        <View style={styles.name}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>City</Text>
          <Input
            onChangeText={(value: string) => setCity(value)}
            value={city}
            keyboardType="email-address"
            autoCapitalize="none"
            borderRadius={10}
            color="white"
            bgColor="rgba(2, 48, 71, 0.7)"
            w="100%"
            marginTop={3}
          />
        </View>
        <View style={styles.name}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Name your road</Text>
          <Input
            onChangeText={(value: string) => setName(value)}
            value={name}
            borderRadius={10}
            color="white"
            bgColor="rgba(2, 48, 71, 0.7)"
            w="100%"
            marginTop={3}
          />
        </View>
        <View style={styles.description}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Say a litlle more</Text>
          <Input
            onChangeText={(value: string) => setDescription(value)}
            value={description}
            borderRadius={10}
            color="white"
            bgColor="rgba(2, 48, 71, 0.7)"
            w="100%"
            h={200}
            marginTop={3}
          />
        </View>
        <View style={styles.switch}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Share my trip with the community :
          </Text>
          <Switch
            onValueChange={() => {
              toggleSwitch();
            }}
            value={isPublic}
          />
        </View>

        <View style={styles.btnContainer}>
          <Button
            style={{ backgroundColor: 'transparent' }}
            onPress={() => {
              navigation.navigate('Explore');
              dispatch(resetLike());
            }}>
            <Text style={{ color: 'white', textDecorationLine: 'underline' }}>
              Dont save my road
            </Text>
          </Button>
          <Button
            style={{ backgroundColor: '#219EBC' }}
            onPress={() => {
              fetch('https:wanderlust-backend.vercel.app/itineraries/addItinerary', {
                method: 'Post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  profile_id: user.profile_id,
                  viewpointsList: route.params.idsList,
                  km: route.params.distance,
                  map: route.params.duration,
                  photos: '',
                  name: name,
                  description: description,
                  public: isPublic,
                  custom: true,
                  isSponsor: false,
                  city: city,
                }),
              })
                .then((response) => response.json())
                .then((data: itineraryTypes) => {
                  console.log(data);
                  navigation.navigate('MyTrips');
                });
              dispatch(resetLike());
            }}>
            Save my road
          </Button>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#182535',
  },
  title: {
    fontFamily: 'Inter_500Medium',
    marginTop: '20%',
    fontSize: 24,
    color: 'white',
    width: 200,
    textAlign: 'center',
  },
  name: {
    width: '90%',
    marginTop: '5%',
  },
  description: {
    width: '90%',
    marginTop: '5%',
  },
  switch: {
    width: '90%',
    marginTop: '5%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    marginTop: '5%',
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-around',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
});

export default ExploreSaveScreen;
