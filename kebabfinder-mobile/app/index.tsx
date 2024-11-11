import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './auth/login';
import IndexView from './main';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { SendUserRequest } from '../helpers/authHelper'


export default function Index() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken != null) {
        try{
          const userResponse = await SendUserRequest(userToken);
          if(userResponse.status >= 200 && userResponse.status < 300)
          {
              await AsyncStorage.setItem('userId', userResponse.data.id.toString())
              router.push('/main'); 
          }

        }
        catch(error){
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
          router.push('/auth/login');
        }
      }
      else{
        router.push('/auth/login')
      }
    };

    checkLoginStatus();
  }, [router]);
  
  return (
    <View
    style={{
      flex: 1,
      justifyContent: "center",
    }}
    >
    </View>
  );
}

