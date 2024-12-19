import { API_BASE_URL } from "@/config";
import { ApiResponse } from "@/interfaces/ApiResponse";
import { Kebab, KebabFavourite } from "@/interfaces/KebabTypes";
import axios, { AxiosResponse } from "axios";

export const SendGetFavourites = async (token: string) =>
    {
        const getHeaders = {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const response: AxiosResponse<KebabFavourite[]> = await axios.get(
            API_BASE_URL + '/api/user/favourites',
            {
              headers: getHeaders
            }
          );
          return response;
    }

    export const SetFavouriteKebab = async (token: string, kebabId: number) => {
      const postHeaders = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
      };
  
      const response: AxiosResponse<ApiResponse> = await axios.post(
          `${API_BASE_URL}/api/kebabs/${kebabId}/favourite`,
          {}, 
          { headers: postHeaders } 
      );
  
      return response;
  };

    export const RemoveFromFavourite = async (token: string, kebabId: number) => {
      const deleteHeaders = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
      };

      const response: AxiosResponse<ApiResponse> = await axios.delete(
          `${API_BASE_URL}/api/kebabs/${kebabId}/favourite`,
          { headers: deleteHeaders } 
      );

      return response;
  };

  export const SendGetKebab = async (token: string, kebabId: number) =>
    {
        const getHeaders = {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const response: AxiosResponse<Kebab> = await axios.get(
            API_BASE_URL + '/api/kebabs/' + kebabId,
            {
              headers: getHeaders
            }
          );
          return response;
    }

    export const GetKebabsOutOfFavourites = async (token: string, favourites: KebabFavourite[]) => {
      let kebabs: Kebab[] = [];
      
      for (let fav of favourites) {
        let kebabResponse = await SendGetKebab(token, fav.pivot.kebab_id);
        if (kebabResponse.status >= 200 && kebabResponse.status < 300) {
          kebabs.push(kebabResponse.data);
        }
      }
      return kebabs;
    }