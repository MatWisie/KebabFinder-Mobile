import SafeImage from "@/components/SafeImage";
import { handleRequestError } from "@/helpers/errorHelper";
import { SendGetKebabsRequest } from "@/helpers/mapHelper";
import { Kebab } from "@/interfaces/KebabTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, SafeAreaView, FlatList } from "react-native"
import Feather from '@expo/vector-icons/Feather';
import { Region } from "react-native-maps";
import DotsNavigation from "@/components/DotsNavigation";


const KebabListView = () =>{
        const [loading, setLoading] = useState(false);
        const [kebabs, setKebabs] = useState<Kebab[]>([]);
        const [kebabsPage, setKebabsPage] = useState<Kebab[]>([]);
        const [token, setToken] = useState<string | null>('');
        const [numberOfPages, setNumberOfPages] = useState<number>(0);
        const itemsPerPage = 10;
        const router = useRouter();
        const onMore = (kebab:Kebab) =>{
            router.push({
                pathname: '/main/more',
                params:{ kebab: JSON.stringify(kebab)}
              });
        }

        const onShowOnMap = (kebab: Kebab) => {
            const [latitude, longitude] = kebab.coordinates
            .split(',')
            .map((coord) => parseFloat(coord.trim()));
            const tmpRegion: Region = {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.01, 
                longitudeDelta: 0.01,
              };
            router.navigate({
                pathname: '/main/(tabs)',
                params:{ paramRegion: JSON.stringify(tmpRegion)}
              });
        }
        const onCurrentPageChanged = (pageNumber:number) =>{
            const startIndex = pageNumber * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            setKebabsPage(kebabs.slice(startIndex, endIndex));
        }

        useFocusEffect(
            useCallback(() => {
              const getKebabs = async () => {
                const userToken = await AsyncStorage.getItem('userToken');
                setToken(userToken);
                try {
                  setLoading(true);
                  const kebabResponse = await SendGetKebabsRequest(userToken ?? '');
                  if (kebabResponse.status >= 200 && kebabResponse.status < 300) {
                    setKebabs(kebabResponse.data);
                    setNumberOfPages(Math.ceil(kebabResponse.data.length/10));
                    setKebabsPage(kebabResponse.data.slice(0, itemsPerPage));
                  }
                } catch (error) {
                  handleRequestError(error);
                } finally {
                  setLoading(false);
                }
              };
          
              getKebabs();
            }, [])
          );
    const renderKebabs = ({ item }: { item: Kebab }) => {
        return (
            <View style={styles.kebabContainer}>
                <TouchableOpacity onPress={() => onMore(item)}>
                    <SafeImage
                    imageSource={item.logo_link } 
                    style={styles.logo}/>
                </TouchableOpacity>
                <View style={[styles.kebabContent, {width:'80%'}]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{flex:2}}>
                            <Text style={styles.kebabName}>{item.name}</Text>
                        </View>
                        <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={() => onShowOnMap(item)}>
                            <Feather name="map" size={24} color="black" />
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
        <SafeAreaView style={{ flex: 1, margin: 20, padding: 20 }}>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
          Found kebabs: {kebabs.length}
        </Text>
        <View style={{ flex: 1, marginBottom: 10 }}>
          <FlatList
            data={kebabsPage}
            renderItem={renderKebabs}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
        <DotsNavigation
          numberOfPages={numberOfPages}
          onPageChange={onCurrentPageChanged}
        />
      </SafeAreaView>
    );
    
}
const styles = StyleSheet.create({
    kebabContainer: {
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
    kebabContent: {
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
  

export default KebabListView;
