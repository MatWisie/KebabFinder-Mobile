import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import { LoginViewProps, UserLoginData } from '../../interfaces/AuthTypes';
import { SendLoginRequest } from '../../helpers/authHelper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
var style = require('./loginRegisterStyles');
  
  const LoginView = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = async () => {

      if (!username || !password) {
        alert('Please fill in all fields');
        return;
      }

      const userData: UserLoginData = {
        name: username,
        password
      }

      try {
        const response = await SendLoginRequest(userData);
  
        if (response.status >= 200 && response.status < 300) {
          const token = response.data.token;
          await AsyncStorage.setItem('userToken', token);
          router.push('/main');
        } else {
          alert(response.data.message || 'Login failed');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errors = error.response?.data?.errors;
          if (errors) {
            let errorMessages = '';
    
            Object.keys(errors).forEach((field) => {
              errorMessages += `${field}: ${errors[field].join(', ')}\n`;
            });
    
            alert(errorMessages.trim());
          } else {
            alert(error.response?.data?.message);
          }
        } else {
          alert('An unexpected error occurred');
        }
      }
    };
  
    return (
      <View style={style.container}>
        <Text style={style.title}>Login</Text>
        <TextInput
          style={style.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={style.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Login" onPress={handleLogin} />
        <Text style={style.loginregistertext}>
          <Link href={'/auth/register'}>
              Don't have an account yet? Register
          </Link>
      </Text>
      </View>
    );
  };
  
  export default LoginView;