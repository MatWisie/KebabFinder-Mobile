export interface ApiResponse {
      message: string;
    }

export interface RegisterApiResponse{
    message: string;
    token: string;
}

export interface SmallUserApiResponse{
    id: number;
    name: string;
    email: string;
}