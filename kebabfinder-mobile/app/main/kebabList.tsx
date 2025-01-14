import SafeImage from "@/components/SafeImage";
import { handleRequestError } from "@/helpers/errorHelper";
import { SendGetKebabsRequest } from "@/helpers/mapHelper";
import { Kebab } from "@/interfaces/KebabTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, SafeAreaView, FlatList, Modal } from "react-native"
import Feather from '@expo/vector-icons/Feather';
import { Region } from "react-native-maps";
import DotsNavigation from "@/components/DotsNavigation";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SortPicker from "@/components/SortPicker";
import { Picker } from "@react-native-picker/picker";
import KebabFilter from "@/components/KebabFilter";
import { FilterResult } from "@/interfaces/FilterTypes";
import { filterKebabs } from "@/helpers/filterHelper";


const KebabListView = () =>{
        const [loading, setLoading] = useState(false);
        const [kebabs, setKebabs] = useState<Kebab[]>([]);
        const [kebabsFinal, setKebabsFinal] = useState<Kebab[]>([]);
        const [kebabsPage, setKebabsPage] = useState<Kebab[]>([]);
        const [isFilterVisible, setIsFilterVisible] = useState(false);
        const [token, setToken] = useState<string | null>('');
        const [numberOfPages, setNumberOfPages] = useState<number>(0);

        var lastSortKey : keyof Kebab = 'name';
        var lastSortIsDescending : boolean = false;

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
            setKebabsPage(kebabsFinal.slice(startIndex, endIndex));
        }
        const onSortChanged = (item: keyof Kebab, isDescending: boolean, kebabsToSort:Kebab[] = [], force: boolean = false) => {
            if(kebabsToSort.length == 0 && !force) kebabsToSort = kebabsFinal;
            lastSortKey = item;
            lastSortIsDescending = isDescending;
            const sorted = [...kebabsToSort].sort((a, b) => {
                if (typeof a[item] === 'string' && typeof b[item] === 'string') {
                  return isDescending 
                    ? b[item].localeCompare(a[item]) 
                    : a[item].localeCompare(b[item]);  
                } else if (typeof a[item] === 'number' && typeof b[item] === 'number') {
                  return isDescending
                    ? b[item] - a[item] 
                    : a[item] - b[item];  
                }
                return 0; 
              });
            setKebabsFinal(sorted);
            setKebabsPage(sorted.slice(0, itemsPerPage));
          };
        const onFilter = (filterResult: FilterResult) => {
          setIsFilterVisible(false);
          const filteredKebabs = filterKebabs(kebabs, filterResult);
          setKebabsFinal(filteredKebabs);
          setNumberOfPages(Math.ceil(filteredKebabs.length/10));
          onSortChanged(lastSortKey, lastSortIsDescending, filteredKebabs, true);
        }
        const onFilterOff = () => {
          setIsFilterVisible(false);
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
                  }
                } catch (error) {
                  handleRequestError(error);
                } finally {
                  setLoading(false);
                }
              };
              setIsFilterVisible(false);
              getKebabs();
            }, [])
          );

        useEffect(() => {
        if (kebabs.length > 0) {
            setKebabsFinal(kebabs)
            onSortChanged('name', false, kebabs, true); 
        }
        }, [kebabs]);
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
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom:10}}>
            <Text style={{ flex: 1, fontWeight: 'bold', justifyContent:'center'}}>
                Found kebabs: {kebabsFinal.length}
            </Text>
            <View style={{ flexDirection: 'row' }}>
                <SortPicker sortByChanged={onSortChanged}/>
                <TouchableOpacity style={{justifyContent:'center'}} onPress={() => {setIsFilterVisible(true)}}>
                    <MaterialCommunityIcons name="filter" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
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

        <Modal animationType='slide' visible={isFilterVisible}>
           <KebabFilter kebabs={kebabs} onApply={onFilter} onClose={onFilterOff}/>
        </Modal>
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
