import { handleRequestError } from "@/helpers/errorHelper";
import { SendReportPostRequest } from "@/helpers/reportsHelper";
import { KebabReport } from "@/interfaces/ReportTypes";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Text, TextInput, Button } from "react-native"

const KebabReportView = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { tokenSearchParam, kebabIdSearchParam } = params;
    const [token, setToken] = useState<string>('');
    const [kebabId, setKebabId] = useState<string>('');
    const [reportContent, setReportContent] = useState('');

    useEffect(() => {
        if (tokenSearchParam) {
            setToken(Array.isArray(tokenSearchParam) ? tokenSearchParam[0] : tokenSearchParam);
        }

        if(kebabIdSearchParam){
            setKebabId(Array.isArray(kebabIdSearchParam) ? kebabIdSearchParam[0] : kebabIdSearchParam);
        }

    }, []); 

    const OnAcceptClick = async () => {
        const reportData: KebabReport = {
            kebab_id: Number(kebabId),
            content: reportContent
        };
        try {
            if (!reportContent.trim()) {
                Alert.alert('Please fill in all fields');
                return; 
            }
            
            const response = await SendReportPostRequest(token, reportData);
            if (response.status >= 200 && response.status < 300) {
                router.back();
            } else {
                Alert.alert('Error', response.data.message || 'Failed to create kebab report');
            }
        } catch (error) {
            handleRequestError(error);
        }
    }

    return (
        <View style={{ margin: 30, alignItems: 'center', marginTop:100 }}>
            <Text style={styles.inputLabel}>Content</Text>
            <TextInput
                value={reportContent} 
                placeholder="Suggested changes" 
                onChangeText={setReportContent}
                style={styles.contentInput} 
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
    contentInput:{
        backgroundColor: 'white', 
        borderColor:'black', 
        borderWidth:1, 
        minWidth:'80%'
    }
})

export default KebabReportView;