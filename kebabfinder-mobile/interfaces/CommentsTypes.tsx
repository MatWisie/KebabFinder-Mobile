import { UserData } from "./UserTypes";

export interface Comment {
    id: number;
    kebab_id: number;
    user_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    user: UserData;
}

export interface CommentPost{
    content:string;
}