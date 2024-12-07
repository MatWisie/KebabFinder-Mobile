import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL } from '../config';
import { Comment } from '@/interfaces/CommentsTypes';
import { ApiResponse } from '@/interfaces/ApiResponse';
import { CommentPost } from '@/interfaces/CommentsTypes';


export const SendCommentsGetRequest = async (kebabId: number) =>
    {
        const getHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const response: AxiosResponse<Comment[]> = await axios.get(
            API_BASE_URL + '/api/kebabs/' + kebabId + '/comments',
            {
              headers: getHeaders
            }
          );
          return response;
    }

export const SendCommentPostRequest = async (token: string, userData: CommentPost, kebabId: number) =>
  {
    const postHeaders = {
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      }
      const response: AxiosResponse<ApiResponse> = await axios.post(
          API_BASE_URL + '/api/kebabs/' + kebabId +'/comments',
          userData, 
          {
            headers: postHeaders
          }
        );
        return response;
  }