import { API_BASE_URL } from '../config';
import axios, { AxiosResponse } from 'axios';
import { ApiResponse, RegisterApiResponse, SmallUserApiResponse } from '../interfaces/ApiResponse';
import { UserLoginData, UserRegisterData } from '../interfaces/AuthTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const postHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    }

export const SendRegisterRequest = async (userData: UserRegisterData) =>
    {
        const response: AxiosResponse<ApiResponse> = await axios.post(
            API_BASE_URL + '/api/register',
            userData, 
            {
              headers: postHeaders
            }
          );
          return response;
    }

export const SendLoginRequest = async (userData: UserLoginData) =>
    {
        const response: AxiosResponse<RegisterApiResponse> = await axios.post(
            API_BASE_URL + '/api/user-login',
            userData, 
                {
                    headers: postHeaders
                }
            );
            return response;
    }

    export const SendUserRequest = async (token: string) => {
        const getHeaders = {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    
        const response: AxiosResponse<SmallUserApiResponse> = await axios.get(
            API_BASE_URL + '/api/user',
            {
                headers: getHeaders
            }
        );
    
        return response;
    };

export const LogoutUser = async () =>{
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userEmail');
}

