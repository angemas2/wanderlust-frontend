import { useCallback } from 'react';
import { SafeAreaView, Text, StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { UserState } from '../reducers/user';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Popover, Button } from 'native-base';

import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_500Medium } from '@expo-google-fonts/dev'; //import fonts
import { updateUserProfile } from '../reducers/user';

type HeaderProps = {
  navigation: NavigationProp<ParamListBase>;
};

SplashScreen.preventAutoHideAsync();

export default function Header({ navigation, title }: HeaderProps & { title: string }) {
  const user = useSelector((state: { user: UserState }) => state.user.value);

  const avatar = user.picture ? user.picture : '';

  const dispatch = useDispatch();

  const logout = () => {
    dispatch(
      updateUserProfile({
        username: null,
        email: null,
        picture: null,
        profile_id: null,
        token: null,
      })
    );
    navigation.navigate('Login');
  };

  const [fontsLoaded] = useFonts({
    Inter_500Medium,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <Image source={require('../assets/images/logo-header.png')} style={styles.logo} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.userContainer}>
        <Popover
          trigger={(triggerProps) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate('Profile')} {...triggerProps}>
                <Image style={styles.avatar} source={{ uri: avatar }} />
              </TouchableOpacity>
            );
          }}>
          <Popover.Content accessibilityLabel="Logout" w="56" style={{ top: 20 }}>
            <Popover.Arrow style={{ top: 25 }} />
            <Popover.CloseButton />
            <Popover.Header>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Hi! 🖐 Welcome to Wanderlust</Text>
            </Popover.Header>
            <Popover.Body
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Image style={styles.avatar} source={{ uri: avatar }} />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#FFB703' }}>
                  {user.username}
                </Text>
                <Text style={{ fontSize: 10 }}>{user.email}</Text>
              </View>
              <TouchableOpacity
                style={styles.viewProfile}
                onPress={() => navigation.navigate('Profile')}>
                <Text>View Profile</Text>
              </TouchableOpacity>
            </Popover.Body>
            <Popover.Footer justifyContent="flex-end">
              <Button.Group space={2}>
                <Button colorScheme="coolGray" variant="ghost">
                  Close
                </Button>
                <Button
                  colorScheme="warning"
                  style={{ backgroundColor: '#219EBC' }}
                  onPress={() => logout()}>
                  Log out
                </Button>
              </Button.Group>
            </Popover.Footer>
          </Popover.Content>
        </Popover>

        <Text style={styles.username}>{user.username}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '10%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: '10%',
  },
  logo: {
    aspectRatio: 1,
    width: 200,
    right: '40%',
    bottom: '35%',
  },
  title: {
    fontFamily: 'Inter_500Medium',
    fontSize: 20,
    textAlign: 'center',
    right: '80%',
    width: 150,
    color: '#023047',
    marginTop: '5%',
  },
  userContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '18%',
    height: '100%',
  },
  avatar: {
    aspectRatio: 1,
    borderRadius: 100,
    maxHeight: 50,
  },
  username: {
    fontSize: 10,
    textAlign: 'center',
    width: '70%',
    color: '#023047',
    opacity: 0.5,
  },
  viewProfile: {
    flexDirection: 'column',
  },
});
