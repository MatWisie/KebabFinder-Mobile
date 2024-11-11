import Constants from "expo-constants";
const { manifest } = Constants;

export const API_BASE_URL = 'http://192.168.1.82:8000';
export const uri =
  Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8000') ??
  'yourapi.com';