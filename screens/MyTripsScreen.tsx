import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  View,
  useWindowDimensions,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { UserState } from "../reducers/user";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { Box, Input, Button, Icon, Radio, FlatList, Stack } from "native-base";

type NavigationScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function MyTripsScreen({ navigation }: NavigationScreenProps) {
  const user = useSelector((state: { user: UserState }) => state.user.value);
  const [trips, setTrips] = useState<any[]>();
  const [followedTrips, setFollowedTrips] = useState<any[]>();
  const [routeType, setRouteType] = useState(true);

  useEffect(() => {
    fetch(
      `https://wanderlust-backend.vercel.app/itineraries/profile/${user.profile_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setTrips(data.data);
      });
  }, [trips]);

  useEffect(() => {
    fetch(
      `https://wanderlust-backend.vercel.app/itineraries/followed/${user.profile_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setFollowedTrips(data.data);
      });
  }, [followedTrips]);

   // const tripList = trips.map((data: any, i) => {
  //   return (
  //     <View style={styles.tripCont} key={i}>
  //       <Pressable
  //         onPress={() => {
  //           navigation.navigate("ItinerarySummary", { ...data });
  //         }}
  //       >
  //         <ImageBackground
  //           imageStyle={{ opacity: 0.3 }}
  //           blurRadius={2}
  //           source={{ uri: data.viewpoints_id[0]?.photos }}
  //           style={styles.imgBg}
  //         >
  //           <View
  //             style={{
  //               display: "flex",
  //               width: "100%",
  //               justifyContent: "center",
  //               alignItems: "center",
  //             }}
  //           >
  //             <Text style={styles.tripTitle}>{data.name}</Text>
  //             <View style={styles.itineraryDatas}>
  //               <Text style={{ color: "white" }}>
  //                 {data.km.toFixed(2)} km | {data.viewpoints_id.length} spots
  //               </Text>
  //             </View>
  //           </View>
  //         </ImageBackground>
  //       </Pressable>
  //     </View>
  //   );
  // });

  /*const followedTripList = followedTrips.map((data: any, i) => {
    return (
      <View style={styles.tripCont} key={i}>
        <Pressable
          onPress={() => {
            navigation.navigate("ItinerarySummary", { ...data });
          }}
        >
          <ImageBackground
            imageStyle={{ opacity: 0.3, borderRadius: 15 }}
            source={{ uri: data.viewpoints_id[0]?.photos }}
            style={styles.imgBg}
          >
            <View
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.tripTitle}>{data.name}</Text>
              <View style={styles.itineraryDatas}>
                <Text style={{ color: "white" }}>
                  {data.city}|{data.km.toFixed(2)} km |{" "}
                  {data.viewpoints_id.length} spots
                </Text>
              </View>
            </View>
          </ImageBackground>
        </Pressable>
      </View>
    );
  });*/

  const FirstRoute = () => (
    <FlatList
      ListHeaderComponent={<Text>My Custom Trips</Text>}
      showsVerticalScrollIndicator={false}
      data={trips}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.tripCont}>
          <Pressable
            onPress={() => {
              navigation.navigate("ItinerarySummary", { ...item });
            }}
          >
            <ImageBackground
              imageStyle={{ opacity: 0.3 }}
              blurRadius={2}
              source={{ uri: item.viewpoints_id[0]?.photos }}
              style={styles.imgBg}
            >
              <View
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.tripTitle}>{item.name}</Text>
                <View style={styles.itineraryDatas}>
                  <Text style={{ color: "white" }}>
                    {item.km.toFixed(2)} km | {item.viewpoints_id.length} spots
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        </View>
      )}
    />
  );

  const SecondRoute = () => (
    <FlatList
      ListHeaderComponent={<Text>Trips I followed</Text>}
      showsVerticalScrollIndicator={false}
      data={followedTrips}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.tripCont}>
          <Pressable
            onPress={() => {
              navigation.navigate("ItinerarySummary", { ...item });
            }}
          >
            <ImageBackground
              imageStyle={{ opacity: 0.3 }}
              blurRadius={2}
              source={{ uri: item.viewpoints_id[0]?.photos }}
              style={styles.imgBg}
            >
              <View
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.tripTitle}>{item.name}</Text>
                <View style={styles.itineraryDatas}>
                  <Text style={{ color: "white" }}>
                    {item.km.toFixed(2)} km | {item.viewpoints_id.length} spots
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        </View>
      )}
    />
  );

  /*const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Custom" },
    { key: "second", title: "Followed" },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      activeColor={"#FFB703"}
      inactiveColor={"#023047"}
      style={{ paddingTop: 55, backgroundColor: "white" }}
      scrollEnabled={false}
    />
  );*/

  return (
    <View style={styles.container}>
      <>
        <Radio.Group
          name="Route types"
          defaultValue="1"
          style={{
            backgroundColor: "#219EBC",
            width: "100%",
            height: "10%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onChange={() => {
            setRouteType(!routeType);
          }}
        >
          <Stack
            direction={{
              base: "row",
              md: "row",
            }}
            alignItems={{
              base: "center",
              md: "center",
            }}
            justifyContent={"center"}
            space={4}
            w="100%"
          >
            <Radio value="1" colorScheme="white" size="md" my={1}>
              <Text style={{ color: "white" }}>Custom</Text>
            </Radio>
            <Radio value="2" colorScheme="white" size="md" my={1}>
              <Text style={{ color: "white" }}>Followed</Text>
            </Radio>
          </Stack>
        </Radio.Group>
      </>
      <ScrollView>{routeType ? FirstRoute() : SecondRoute()}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
  },
  tripCont: {
    width: "95%",
    height: 200,
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(2, 48, 71, 0.8)",
    borderRadius: 15,
  },
  imgBg: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    width: "90%",
    color: "white",
  },
  itineraryDatas: {
    display: "flex",
    flexDirection: "row",
    marginTop: 40,
  },
  tabView: {
    marginTop: 50,
  },
});
