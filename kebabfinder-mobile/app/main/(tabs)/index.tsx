import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Modal, Text, TouchableOpacity, Image, Button } from 'react-native';
import MapView, { UrlTile, Marker, Callout, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SendGetKebabsRequest } from '../../../helpers/mapHelper';
import { Kebab } from '@/interfaces/KebabTypes';
import { Link, useRouter, useFocusEffect, useLocalSearchParams  } from 'expo-router';
import axios from 'axios';
import FavouriteHeart from '@/components/FavouriteHeart';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';

const IndexView = () => {
  const [kebabMarkers, setKebabMarkers] = useState<Kebab[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedKebab, setSelectedKebab] = useState<Kebab | null>(null);
  const [userToken, setUserToken] = useState<string>('');
  const { paramRegion} = useLocalSearchParams();
  const [initialRegion, setInitialRegion] = useState<Region>({
    latitude: 51.2070,
    longitude: 16.1559,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const getMarkerColor = (status:string) =>{
    switch(status){
      case 'closed':
        return 'red';
      case 'open':
        return '#1fa64a';
      case 'planned':
        return 'yellow';
      default:
        return 'gray';
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false);
      if(paramRegion != null && paramRegion != undefined && paramRegion != ''){
        setInitialRegion(JSON.parse(paramRegion as string));
      }
    }, [])
  );

  useEffect(() => {
    const getMarkers = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken != null) {
        try {
          setUserToken(userToken);
          const kebabResponse = await SendGetKebabsRequest(userToken);
          if (kebabResponse.status >= 200 && kebabResponse.status < 300) {
            setKebabMarkers(kebabResponse.data);
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const errors = error.response?.data?.errors;
            if (errors) {
              let errorMessages = '';

              Object.keys(errors).forEach((field) => {
                errorMessages += `${field}: ${errors[field].join(', ')}\n`;
              });

              alert(errorMessages.trim());
            } else {
              alert(error.response?.data?.message);
            }
          } else {
            alert('An unexpected error occurred');
          }
        } finally {
          setLoading(false);
        }
      }
    };

    getMarkers();
  }, []);

  const handleMarkerPress = (kebab: Kebab) => {
    setSelectedKebab(kebab);
    setModalVisible(true);
  };

  const router = useRouter();
  const closeModal = () => {
    setModalVisible(false);
  };

  const onMore = () => {
    setModalVisible(false);
    router.push({
      pathname: '/main/more',
      params:{ kebab: JSON.stringify(selectedKebab)}
    });
  }

  const onKebabList = () => {
    setModalVisible(false);
    router.push('/main/kebabList');
  }

  const onReportKebab = () =>{
    setModalVisible(false);
    router.push({
      pathname: '/main/kebabReport',
      params:
      { 
        tokenSearchParam: userToken,
        kebabIdSearchParam: selectedKebab?.id
      }
    });
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        key={kebabMarkers.length}
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
      >

        {kebabMarkers.map((kebab) => {
          const [latitude, longitude] = kebab.coordinates
            .split(',')
            .map((coord) => parseFloat(coord.trim()));

            let markerColor = getMarkerColor(kebab.status);

          return (
            <Marker
              key={kebab.id}
              pinColor={markerColor}
              coordinate={{ latitude, longitude }}
              onPress={() => handleMarkerPress(kebab)}
            />
          );
        })}
      </MapView>

      <TouchableOpacity style={{
            position:'absolute',
            top: 20,
            left: 20,
            width: 50,
            height: 50,
            backgroundColor: 'white',
            borderWidth:1,
            borderColor:'black',
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',}}
            onPress={onKebabList}>
              <Feather name="list" size={25} color="black"/>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
          <View style={styles.heartContainer}>
            <TouchableOpacity style={{marginRight:10}} onPress={onReportKebab}>
              <Ionicons name="flag" size={25} color="gray"/>
            </TouchableOpacity>
            <FavouriteHeart kebabId={selectedKebab?.id ?? 0} />
          </View>
            {selectedKebab && (
              <>
                {selectedKebab.logo_link != '' && selectedKebab.logo_link != null ? (
                          <View style={styles.imageContainer}>
                          <Image 
                            source={{ uri: selectedKebab.logo_link }} 
                            style={styles.image} 
                          />
                        </View>
                ) : null}
                <Text style={styles.modalTitle}>{'Name: ' + selectedKebab.name}</Text>
                <Text style={styles.modalDescription}>{'Addess: ' + selectedKebab.address}</Text>
                <Button title='More' color={'#7FC7D9'}  onPress={onMore}/>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>CLOSE</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 250,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor:'#365486',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  heartContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center', 
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain', 
  },
});

export default IndexView;