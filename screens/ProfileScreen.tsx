import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, Text, ScrollView, StyleSheet, View } from 'react-native';
import { Box, Input, Button } from 'native-base';
import { useSelector } from 'react-redux';
import user, { UserState } from '../reducers/user';

export default function ProfileScreen() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [testNewPassword, setTestNewPassword] = useState<string>('');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [passwordModified, setPasswordModified] = useState<boolean>(false);

  const user = useSelector((state: { user: UserState }) => state.user.value);
  const avatar = user.picture ? user.picture : '';

  type userData = {
    result: boolean;
    error: string;
    data: {
      _id: string;
      email: string;
      username: string;
      password: string;
      token: string;
      registetrationBy: string;
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
    };
  };

  useEffect(() => {
    fetch(`https://wanderlust-backend.vercel.app/users/${user.profile_id}`)
      .then((response) => response.json())
      .then((userData: userData) => {
        if (!userData.result) {
          console.log(userData.error);
        } else {
          const User = userData.data;
          setEmail(User.email);
          setUsername(User.username);
        }
      });
  }, []);

  const handlePasswordSubmit = () => {
    if (newPassword !== testNewPassword) {
      setResultMessage("New password doesn't match in both fields. Please verify your typing");
    } else {
      fetch(`http://localhost:3000/users/changePassword/${user.token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
          testNewPassword: testNewPassword,
        }),
      })
        .then((response) => response.json())
        .then((data: userData) => {
          if (!data.result) {
            setResultMessage(data.error);
            setPasswordModified(false);
          } else {
            setResultMessage('Your password has been changed');
            setPasswordModified(true);
          }
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <Text>{user.username}</Text>
      <Text>{user.email}</Text>

      <Box style={styles.content}>
        <Input
          placeholder={username}
          style={styles.input}
          onChangeText={(value) => setUsername(value)}
          value={username}></Input>
        <Input
          placeholder="Type new e-mail address"
          style={styles.input}
          onChangeText={(value) => setEmail(value)}
          value={email}></Input>
      </Box>
      <Box style={styles.content}>
        <Input
          placeholder="Type current password"
          style={styles.input}
          onChangeText={(value) => setCurrentPassword(value)}
          value={currentPassword}></Input>
        <Input
          placeholder="Type new password"
          style={styles.input}
          onChangeText={(value) => setNewPassword(value)}
          value={newPassword}></Input>
        <Input
          placeholder="Type new password again"
          style={styles.input}
          onChangeText={(value) => setTestNewPassword(value)}
          value={testNewPassword}></Input>
        <Button style={styles.button} onPress={() => handlePasswordSubmit}>
          Change password
        </Button>
        <Text style={passwordModified ? styles.passwordIsModified : styles.passwordNotModified}>
          {resultMessage}
        </Text>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '50%',
    height: '20%',
  },
  content: {
    width: '90%',
    height: '15%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  input: {
    width: '100%',
  },
  button: {
    width: '25%',
  },
  passwordIsModified: {
    color: 'green',
    marginTop: 10,
  },
  passwordNotModified: {
    color: 'red',
    marginTop: 10,
  },
});
