import { API_BASE_URL } from '../config';
import axios, { AxiosResponse } from 'axios';
import { ApiResponse } from '../interfaces/ApiResponse';
import { Kebab } from '../interfaces/KebabTypes'

const postHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    }

export const SendGetKebabsRequest = async (token: string) =>
    {
        const getHeaders = {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const response: AxiosResponse<Kebab[]> = await axios.get(
            API_BASE_URL + '/api/kebabs',
            {
              headers: getHeaders
            }
          );
          return response;
    }