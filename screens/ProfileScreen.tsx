import React, { useState } from 'react';
import { Image, SafeAreaView, Text, StyleSheet } from 'react-native';
import { Box, Input, Button } from 'native-base';

import { useSelector } from 'react-redux';
import { UserState } from '../reducers/user';

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [testNewPassword, setTestNewPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/images/default.jpg')} />
      <Text>Pâtàcrêpe</Text>

      <Box>
        <Input placeholder="Username"></Input>
        <Input placeholder="e-mail"></Input>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
