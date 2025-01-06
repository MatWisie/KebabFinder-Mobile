import { API_BASE_URL } from "@/config";
import { ApiResponse } from "@/interfaces/ApiResponse";
import { KebabReport } from "@/interfaces/ReportTypes";
import axios, { AxiosResponse } from "axios";

export const SendReportPostRequest = async (token: string, reportData: KebabReport) =>
    {
      const postHeaders = {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        }
        const response: AxiosResponse<ApiResponse> = await axios.post(
            API_BASE_URL + '/api/reports',
            reportData, 
            {
              headers: postHeaders
            }
          );
          return response;
    }