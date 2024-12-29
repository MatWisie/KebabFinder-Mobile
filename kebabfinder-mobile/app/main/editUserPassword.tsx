import { handleRequestError } from "@/helpers/errorHelper";
import { SendUserDataChange, SendUserPasswordChange } from "@/helpers/userHelper";
import { UserPasswordChange } from "@/interfaces/UserTypes";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, View, TextInput, Text, StyleSheet } from "react-native";

const EditUserPasswordView = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { tokenSearchParam } = params;
    const [token, setToken] = useState<string>('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

    useEffect(() => {
        if (tokenSearchParam) {
            setToken(Array.isArray(tokenSearchParam) ? tokenSearchParam[0] : tokenSearchParam);
        }
    }, []); 

    const OnAcceptClick = async () => {
        const userPasswordData: UserPasswordChange = {
            current_password: oldPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirm
        };
        try {
            if (!oldPassword.trim() || !newPassword.trim() || !newPasswordConfirm.trim()) {
                Alert.alert('Please fill in all fields');
                return; 
            }
            if (newPassword !== newPasswordConfirm) {
                Alert.alert('Passwords do not match');
                return; 
            }
            
            const response = await SendUserPasswordChange(token, userPasswordData);
            if (response.status >= 200 && response.status < 300) {
                router.back();
            } else {
                Alert.alert('Error', response.data.message || 'Failed to change password');
            }
        } catch (error) {
            handleRequestError(error);
        }
    }

    return (
        <View style={{ margin: 30, alignItems: 'center', marginTop:100 }}>
            <Text style={styles.inputLabel}>Old password</Text>
            <TextInput
                value={oldPassword} 
                placeholder="Enter old password" 
                secureTextEntry={true}
                onChangeText={setOldPassword}
                style={styles.passwordInput} 
            />

            <Text style={styles.inputLabel}>New password</Text>
            <TextInput
                value={newPassword} 
                placeholder="Enter new password" 
                secureTextEntry={true}
                onChangeText={setNewPassword}
                style={styles.passwordInput} 
            />

            <Text style={styles.inputLabel}>Confirm new password</Text>
            <TextInput
                value={newPasswordConfirm} 
                secureTextEntry={true}
                placeholder="Confirm password" 
                onChangeText={setNewPasswordConfirm}
                style={styles.passwordInput} 
            />

            <View style={{marginTop:20}}>
                <Button title="Accept" onPress={OnAcceptClick} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    inputLabel:{
        width:'80%',
        marginTop:10
    },
    passwordInput:{
        backgroundColor: 'white', 
        borderColor:'black', 
        borderWidth:1, 
        minWidth:'80%'
    }
})

export default EditUserPasswordView;