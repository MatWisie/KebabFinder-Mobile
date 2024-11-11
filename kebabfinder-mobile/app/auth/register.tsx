import { View, Text, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import { UserRegisterData } from '../../interfaces/AuthTypes';
import { SendRegisterRequest } from '../../helpers/authHelper';
var style = require('./loginRegisterStyles');

  const RegisterView = () => {

    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const HandleRegister = async () => {
      if (!username || !email || !password || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
  
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
  
      const userData: UserRegisterData = {
        name: username,
        email,
        password,
        password_confirmation: confirmPassword
      };
      try {
        const response = await SendRegisterRequest(userData);
  
        if (response.status >= 200 && response.status < 300) {
          Alert.alert('Success', 'Registration successful');
          router.push('/auth/login');
        } else {
          Alert.alert('Error', response.data.message || 'Registration failed');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errors = error.response?.data?.errors;
          if (errors) {
            let errorMessages = '';
    
            Object.keys(errors).forEach((field) => {
              errorMessages += `${field}: ${errors[field].join(', ')}\n`;
            });
    
            Alert.alert('Error', errorMessages.trim());
          } else {
            Alert.alert('Error', error.response?.data?.message);
          }
        } else {
          Alert.alert('Error', 'An unexpected error occurred');
        }
      }
    };

    return (
      <View style={style.container}>
        <Text style={style.title}>Register</Text>
        <TextInput
          style={style.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={style.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={style.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={style.input}
          placeholder="Confirm password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button title="Register" onPress={HandleRegister} />
        <Text style={style.loginregistertext}>
            <Link href={'/auth/login'}>
              Already have an account? Login
            </Link>
          </Text>
      </View>
    );
  };
  export default RegisterView;