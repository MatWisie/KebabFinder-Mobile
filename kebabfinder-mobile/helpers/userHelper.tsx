import { View, StyleSheet, Text } from "react-native";

export const UserAvatar: React.FC<{ userName: string }> = ({ userName }) => { 
    return (
        <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
                <Text style={{color:'white', textAlign:'center', textAlignVertical:'center', verticalAlign:'middle', marginVertical:'auto'}}>{userName.charAt(0)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        marginRight: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'gray',
    },});