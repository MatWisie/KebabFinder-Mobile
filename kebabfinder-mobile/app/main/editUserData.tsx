import { handleRequestError } from "@/helpers/errorHelper";
import { SendUserDataChange } from "@/helpers/userHelper";
import { UserName } from "@/interfaces/UserTypes";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, View, TextInput, Text } from "react-native";

const EditUserDataView = () => {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const params = useLocalSearchParams();
    const { currentUserName, tokenSearchParam } = params;
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        if (currentUserName) {
            setUserName(Array.isArray(currentUserName) ? currentUserName[0] : currentUserName);
        }
        if (tokenSearchParam) {
            setToken(Array.isArray(tokenSearchParam) ? tokenSearchParam[0] : tokenSearchParam);
        }
    }, []); 

    const OnAcceptClick = async () => {
        const userPostData: UserName = {
            name: userName
        };
        try {
            if(!userName.trim()){
                Alert.alert('Please fill in all fields');
                return; 
            }
            const response = await SendUserDataChange(token, userPostData);
            if (response.status >= 200 && response.status < 300) {
                router.back();
            } else {
                Alert.alert('Error', response.data.message || 'Failed to change data');
            }
        } catch (error) {
            handleRequestError(error);
        }
    }

    return (
        <View style={{ margin: 30, alignItems: 'center', marginTop:100 }}>
            <Text style={{width: '80%'}}>Username</Text>
            <TextInput
                value={userName} 
                placeholder="Enter new username" 
                onChangeText={setUserName}
                style={{backgroundColor: 'white', borderColor:'black', borderWidth:1, minWidth:'80%'}} 
            />
            <View style={{marginTop:20}}>
                <Button title="Accept" onPress={OnAcceptClick} />
            </View>
        </View>
    )
}

export default EditUserDataView;