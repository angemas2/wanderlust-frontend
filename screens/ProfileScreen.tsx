import React, { useState } from 'react';
import { Image, SafeAreaView, Text, StyleSheet } from 'react-native';
import { Box, Input, Button } from 'native-base';

import { useSelector } from 'react-redux';
import user, { UserState } from '../reducers/user';

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [testNewPassword, setTestNewPassword] = useState('');

  const user = useSelector((state: { user: UserState }) => state.user.value);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: user.picture }} style={styles.avatar} />
      <Text>{user.username}</Text>

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
  avatar: {
    width: '60%',
    height: '30%',
  },
});
