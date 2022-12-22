import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Input, Button, Icon, ScrollView, FlatList } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import Header from "../components/Header";

type InspirationScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function InspirationScreen({
  navigation,
}: InspirationScreenProps) {
  const [city, setCity] = useState("Bruxelles");
  const [itineraries, setItineraries] = useState<any[]>();

  useEffect(() => {
    fetch(
      `https://wanderlust-backend.vercel.app/itineraries/${city.toLocaleLowerCase()}`
    )
      .then((response) => response.json())
      .then((data) => {
        setItineraries(data.data);
      });
  }, []);

  const handleSearch = () => {
    fetch(
      `https://wanderlust-backend.vercel.app/itineraries/${city.toLocaleLowerCase()}`
    )
      .then((response) => response.json())
      .then((data) => {
        setItineraries(data.data);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} title="Get Inspired !" />
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.content}>
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
                }}
              >
                <Icon
                  as={<MaterialIcons name="arrow-forward" />}
                  size={8}
                  mr="2"
                  color="#219EBC"
                />
              </Pressable>
            }
          />
          <FlatList
            data={itineraries}
            renderItem={({ item }) => {
              const photo = !!item.viewpoints_id[0]
                ? { uri: `${item.viewpoints_id[0].photos}` }
                : require("../assets/images/background.png");

              return (
                <View style={styles.routeCont}>
                  <ImageBackground
                    style={styles.background}
                    source={photo}
                    imageStyle={{
                      borderRadius: 15,
                      resizeMode: "cover",
                      opacity: 0.8,
                      backgroundColor: "black",
                    }}
                    blurRadius={2}
                  >
                    <View style={styles.desc}>
                      <View style={styles.infos}>
                        <Text style={styles.title}>{item.name}</Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 12,
                              fontWeight: "bold",
                            }}
                          >
                            {item.followers.length - 1}{" "}
                          </Text>
                          <Icon
                            as={<MaterialIcons name="person" />}
                            size={3}
                            ml="1"
                            color="white"
                          />
                        </View>
                        <Text
                          style={{ color: "white", marginTop: 5, fontSize: 10 }}
                        >
                          {item.description}
                        </Text>
                        <Text
                          style={{ color: "white", marginTop: 5, fontSize: 10 }}
                        >
                          {item.km}km | {item.viewpoints_id.length} spots
                        </Text>

                        <Button
                          size={"sm"}
                          style={styles.followBtn}
                          onPress={() => {
                            navigation.navigate("ItineraryDetails", {
                              ...item,
                            });
                          }}
                        >
                          Follow
                        </Button>
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              );
            }}
          ></FlatList>
          {/* {itinerariesList} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  scrollview: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    alignItems: "center",
  },
  routeCont: {
    marginTop: 20,
    width: 350,
    height: 230,
  },
  background: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  infos: {
    justifyContent: "center",
    width: "60%",
    height: "100%",
    backgroundColor: "rgba(2, 48, 71, 0.7)",
    paddingLeft: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },

  desc: {
    justifyContent: "space-around",
    height: "100%",
  },
  followBtn: {
    top: "5%",
    borderRadius: 15,
    width: "85%",
    marginTop: 15,
    marginBottom: 5,
  },
});
