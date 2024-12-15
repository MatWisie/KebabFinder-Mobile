import { RemoveFromFavourite, SendGetFavourites, SetFavouriteKebab } from "@/helpers/favouriteHelper";
import { Fontisto } from "@expo/vector-icons"
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleRequestError } from "@/helpers/errorHelper";
import { Kebab, KebabFavourite } from "@/interfaces/KebabTypes";

const FavouriteHeart: React.FC<{ kebabId: number}> = (kebabId) =>
    {
        const [isFavourite, setIsFavourite] = useState(false);
        const [heartColor, setHeartColor] = useState('gray');
        const favouriteColor = 'red';
        const notFavouriteColor = 'gray';
        const [token, setToken] = useState('');

        useEffect(() =>{
            const setIsCurrentKebabFavourite = async () =>{
                try{
                    const savedToken = await AsyncStorage.getItem('userToken') ?? '';
                    setToken(savedToken);
                    const favouritesResponse = await SendGetFavourites(savedToken);
                    if (favouritesResponse.status >= 200 && favouritesResponse.status < 300) {
                        const isFav = favouritesResponse.data.some((kebab: KebabFavourite) => kebab.pivot.kebab_id == kebabId.kebabId);
                        setIsFavourite(isFav);
                        setHeartColor(isFav ? favouriteColor : notFavouriteColor);
                    }
                }
                catch(error){
                    handleRequestError(error);
                }
            }

            setIsCurrentKebabFavourite();
        }, [kebabId])

        const OnClickAddToFavourite = async () =>{
            try{
                const addResponse = await SetFavouriteKebab(token, kebabId.kebabId);
                if (addResponse.status >= 200 && addResponse.status < 300) 
                    {
                        setIsFavourite(true);
                        setHeartColor(favouriteColor);
                    }
            }
            catch(error){
                handleRequestError(error);
            }
        }

        const OnClickRemoveFromFavourite = async () =>{
            try{
                const removeResponse = await RemoveFromFavourite(token, kebabId.kebabId);
                if (removeResponse.status >= 200 && removeResponse.status < 300){
                    setIsFavourite(false);
                    setHeartColor(notFavouriteColor);
                }
            }
            catch(error){
                handleRequestError(error);
            }
        }

        return(
            <TouchableOpacity onPress={() => isFavourite ? OnClickRemoveFromFavourite() : OnClickAddToFavourite()} style={{alignSelf:'flex-end'}}>
                <Fontisto name='favorite' size={30} color={heartColor} />
            </TouchableOpacity>
        )
    }

export default FavouriteHeart;