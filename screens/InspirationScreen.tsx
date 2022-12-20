import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, ImageBackground, Pressable } from 'react-native';
import { Box, Input, Button, Icon, ScrollView } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Header from '../components/Header';

type InspirationScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function InspirationScreen({ navigation }: InspirationScreenProps) {
  const [city, setCity] = useState('Bruxelles');
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    fetch(`https://wanderlust-backend.vercel.app/itineraries/${city.toLocaleLowerCase()}`)
      .then((response) => response.json())
      .then((data) => {
        setItineraries(data.data);
      });
  }, [itineraries]);

  const handleSearch = () => {
    fetch(`https://wanderlust-backend.vercel.app/itineraries/${city.toLocaleLowerCase()}`)
      .then((response) => response.json())
      .then((data) => {
        setItineraries(data.data);
      });
  };

  const itinerariesList = itineraries.map((data: any, i) => {
    return (
      <View style={styles.routeCont} key={i}>
        <ImageBackground style={styles.bg} source={{ uri: data.viewpoints_id[0].photos }}>
          <View style={styles.desc}>
            <View style={styles.infos}>
              <Text style={styles.title}>{data.name}</Text>
              <Text style={{ color: 'white', fontSize: 10 }}>created by</Text>
              <Text style={{ color: 'white', marginTop: 5, fontSize: 10 }}>{data.description}</Text>
              <Text style={{ color: 'white', marginTop: 5, fontSize: 10 }}>
                {data.km}km | {data.viewpoints_id.length} spots
              </Text>

              <Button
                size={'sm'}
                style={styles.followBtn}
                onPress={() => {
                  navigation.navigate('ItineraryDetails', { ...data });
                }}>
                Follow
              </Button>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  });

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Text>Inspiration screen</Text>
        <Input
          placeholder="City"
          onChangeText={(value: string) => setCity(value)}
          value={city}
          variant="underlined"
          mx="auto"
          w="50%"
          InputRightElement={
            <Pressable
              onPress={() => {
                handleSearch();
              }}>
              <Icon as={<MaterialIcons name="arrow-forward" />} size={8} mr="2" color="#219EBC" />
            </Pressable>
          }
        />
        {itinerariesList}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 80,
  },
  routeCont: {
    marginTop: 20,
    width: '90%',
    height: 200,
  },
  bg: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  infos: {
    display: 'flex',
    justifyContent: 'center',
    width: '55%',
    height: '100%',
    backgroundColor: 'rgba(2, 48, 71, 0.7)',
    paddingLeft: 10,
  },

  desc: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%',
  },
  followBtn: {
    borderRadius: 15,
    width: '85%',
    marginTop: 15,
  },
});
