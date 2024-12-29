import { API_BASE_URL } from "@/config";
import { ApiResponse } from "@/interfaces/ApiResponse";
import { UserName, UserPasswordChange } from "@/interfaces/UserTypes";
import axios, { AxiosResponse } from "axios";
import { View, StyleSheet, Text } from "react-native";

export const UserAvatar: React.FC<{ userName: string; size?: number, fontSize?: number, borderRadius?: number }> = ({ userName, size = 40, fontSize = 15, borderRadius = 20 }) => {
    return (
        <View style={styles.avatarContainer}>
            <View
                style={[
                    styles.avatar,
                    {
                        width: size,
                        height: size,
                        borderRadius:borderRadius
                    },
                ]}
            >
                <Text style={{color:'white', fontSize:fontSize, textAlign:'center', textAlignVertical:'center', verticalAlign:'middle', marginVertical:'auto'}}>{userName.charAt(0)}</Text>
            </View>
        </View>
    );
};

export const SendUserDataChange = async (token:string, userData: UserName) =>{
    const postHeaders = {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        }

    const response: AxiosResponse<ApiResponse> = await axios.put(
        API_BASE_URL + `/api/user/change-username?name=${userData.name}`,
        [], 
        {
            headers: postHeaders
        }
        );
        return response;
}

export const SendUserPasswordChange = async (token:string, userPasswords: UserPasswordChange) =>{
    const postHeaders = {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        }

    const response: AxiosResponse<ApiResponse> = await axios.post(
        API_BASE_URL + `/api/user/change-password`, 
        userPasswords, 
        {
            headers: postHeaders
        }
        );
        return response;
}

const styles = StyleSheet.create({
    avatarContainer: {
        marginRight: 10,
    },
    avatar: {
        backgroundColor: 'gray',
    },});