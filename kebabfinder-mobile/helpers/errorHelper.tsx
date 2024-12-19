import axios from "axios";
import { Alert } from "react-native";

export const handleRequestError = (error:any) =>{
    if (axios.isAxiosError(error)) {
        const errors = error.response?.data?.errors;
        if (errors) {
        let errorMessages = '';

        Object.keys(errors).forEach((field) => {
            errorMessages += `${field}: ${errors[field].join(', ')}\n`;
        });

        Alert.alert('Error', errorMessages.trim());
        } else {
        Alert.alert('Error', error.response?.data?.message);
        }
    } else {
        Alert.alert('Error', 'An unexpected error occurred');
    }
}