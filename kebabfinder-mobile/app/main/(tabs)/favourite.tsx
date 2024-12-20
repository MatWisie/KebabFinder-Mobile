import SafeImage from '@/components/SafeImage';
import { ShowAreYouSureAlert } from '@/helpers/alertHelper';
import { handleRequestError } from '@/helpers/errorHelper';
import { GetKebabsOutOfFavourites, RemoveFromFavourite, SendGetFavourites } from '@/helpers/favouriteHelper';
import { Kebab } from '@/interfaces/KebabTypes';
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isLoaded, isLoading } from 'expo-font';
import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, Button } from 'react-native';

const FavouriteView = () => {
    const [favouriteKebabs, setFavouriteKebabs] = useState<Kebab[]>([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    const getUserFavourites = async () => {
        setLoading(true);
        const savedToken = await AsyncStorage.getItem('userToken') ?? '';
        setToken(savedToken);
        try {
            const favouritesResponse = await SendGetFavourites(savedToken);
            if (favouritesResponse.status >= 200 && favouritesResponse.status < 300) {
                const kebabs = await GetKebabsOutOfFavourites(savedToken, favouritesResponse.data);
                setFavouriteKebabs(kebabs);
            }
        } catch (error) {
            handleRequestError(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getUserFavourites();
        }, [])
    );

    const OnClickRemoveFromFavourite = async (kebabId:number) =>{
        try{
            if(await ShowAreYouSureAlert())
            {
                setLoading(true);
                const removeResponse = await RemoveFromFavourite(token, kebabId);
                if (removeResponse.status >= 200 && removeResponse.status < 300){
                    getUserFavourites();
                }
            }
        }
        catch(error){
            handleRequestError(error);
        }
        finally{
            setLoading(false);
        }
    }
    
    const router = useRouter();
    const onMore = (kebab:Kebab) =>{
        router.push({
            pathname: '/main/more',
            params:{ kebab: JSON.stringify(kebab)}
          });
    }

    const renderFavourites = ({ item }: { item: Kebab }) => {
        return (
            <View style={styles.favouriteContainer}>
                <TouchableOpacity onPress={() => onMore(item)}>
                    <SafeImage
                    imageSource={item.logo_link } 
                    style={styles.logo}/>
                </TouchableOpacity>
                <View style={[styles.favouriteContent, {width:'80%'}]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{flex:2}}>
                            <Text style={styles.kebabName}>{item.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => OnClickRemoveFromFavourite(item.id)} style={{alignSelf:'flex-end'}}>
                            <Text style={{color:'red', fontWeight:'bold'}}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.kebabAddress}>{item.address}</Text>
                </View>
            </View>
        );
    };

    if (loading) {
    return (
        <View style={{justifyContent: 'center',alignItems: 'center',}}>
        <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
    }

    return (
        <SafeAreaView style={{margin:20, padding:20, backgroundColor:"#DCF2F1", borderRadius:20, height: '100%'}}>
            <Text style={{marginBottom:10, fontWeight:'bold'}}>Favourites:</Text>
            <FlatList
                data={favouriteKebabs}
                renderItem={renderFavourites}
                keyExtractor={(item) => item.id.toString()}
            />
        </SafeAreaView>
    );
};
  const styles = StyleSheet.create({
    favouriteContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 10, 
        width: '100%', 
    },
    logo: {
        width: 40,
        height: 40,
        marginRight:10
    },
    favouriteContent: {
        flexDirection: 'column',
    },
    kebabName: {
        fontWeight: 'bold',
    },
    kebabAddress: {
        marginTop: 5,
        fontSize: 14,
        width:'100%',
    }});
  
export default FavouriteView;
