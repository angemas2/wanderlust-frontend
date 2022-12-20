import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

type NavigationScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function TopTabNav({ navigation }: NavigationScreenProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyTrips')}>
        <Text>Custom</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Followed')}>
        <Text>Followed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: 'black',
    shadowRadius: 0.6,
  },
  button: {
    width: '50%',
  },
  text: {},
});
