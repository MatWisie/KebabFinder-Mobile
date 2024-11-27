import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Modal, Text, TouchableOpacity, Image, Button } from 'react-native';
import MapView, { UrlTile, Marker, Callout } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SendRegisterRequest } from '../../helpers/mapHelper';
import { Kebab } from '@/interfaces/KebabTypes';
import { Link, useRouter, useFocusEffect  } from 'expo-router';
import axios from 'axios';

const IndexView = () => {
  const [kebabMarkers, setKebabMarkers] = useState<Kebab[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedKebab, setSelectedKebab] = useState<Kebab | null>(null);

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
    }, [])
  );

  useEffect(() => {
    const getMarkers = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken != null) {
        try {
          const kebabResponse = await SendRegisterRequest(userToken);
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
        initialRegion={{
          latitude: 51.2070,
          longitude: 16.1559,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />

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

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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