import { UserAvatar } from '@/helpers/userHelper';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect, useRouter } from 'expo-router';
import { SendUserRequest } from '@/helpers/authHelper';
import { handleRequestError } from '@/helpers/errorHelper';

const UserProfileView = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [token, setToken] = useState<string>('');
    const router = useRouter();

    useFocusEffect(() =>{
        const getUserDataName = async () => {
            const token = await AsyncStorage.getItem('userToken') ?? '';
            setToken(token)
            try{
                const userResponse = await SendUserRequest(token);
                if (userResponse.status >= 200 && userResponse.status < 300) {
                    setUserName(userResponse.data.name); 
                    setUserEmail(userResponse.data.email); 
                }
            }
            catch(error){
                handleRequestError(error);
            }
        };

        getUserDataName();
    })

    const onUserEditPress = () =>{
        router.push({
            pathname: '/main/editUserData',
            params:
            { 
                currentUserName: userName,
                tokenSearchParam: token
            }
          });
    }

    const onPasswordEditPress = () =>{
        router.push({
            pathname: '/main/editUserPassword',
            params:
            { 
                tokenSearchParam: token
            }
          });
    }

    return (
        <SafeAreaView style={{margin: 40, marginTop:40}}>
            <View style={{alignSelf:'center'}}>
                <UserAvatar userName={userName || ''} size={150} borderRadius={100} fontSize={50}/>
            </View>
            <View style={{marginTop:20, borderRadius:20, padding:10, backgroundColor:'#7FC7D9'}}>
                <View style={[styles.editContainerUserData]}>
                    <Text style={styles.userDataText}>Name: {userName} </Text>
                    <TouchableOpacity onPress={onUserEditPress}>
                        <Feather name='edit-2' size={30} color="blue" />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.userDataText, {paddingHorizontal:5}]}>Email: {userEmail} </Text>
            </View>
            <View style={styles.editContainerPassword}>
                <Text style={styles.userDataText}>Password: ***********</Text>
                <TouchableOpacity onPress={onPasswordEditPress}>
                    <Feather name="edit-2" size={30} color="blue" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    userDataText:{
        fontSize:18,
    },
    editContainerPassword:{
        marginTop: 20,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#7FC7D9',
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center', 
    },
    editContainerUserData:{
        paddingHorizontal: 5,
        flexDirection: 'row', 
        justifyContent: 'space-between',
    }});

export default UserProfileView;