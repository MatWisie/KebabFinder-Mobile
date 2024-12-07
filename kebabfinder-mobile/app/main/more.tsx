import { View, Text, TextInput, ScrollView, Button, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, Linking } from 'react-native';
import React, { useState, useLayoutEffect } from 'react';
import { Link, router, useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Kebab, MeatType, OrderWay, Sauce, SocialMedia } from '@/interfaces/KebabTypes';
import CommentsComponent from '@/components/Comments';

  const MoreView = () => {
    const { kebab } = useLocalSearchParams();  
    const parsedKebab : Kebab = kebab ? JSON.parse(kebab as string) : null;
    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width - 40;
    const [endReached, setEndReached] = useState(false);

    const renderMeatType = ({ item }: { item: MeatType }) => (
        <View>
          <Text style={{marginLeft: 25}}>- {item.name}</Text>
        </View>
      );

      const renderSauces = ({ item }: { item: Sauce }) => (
        <View>
          <Text style={{marginLeft: 25}}>- {item.name}</Text>
        </View>
      );

      const handleLink = (url:string) => {
        Linking.openURL(url);
      };

    useLayoutEffect(() => {
        if (parsedKebab) {
          navigation.setOptions({ title: parsedKebab.name });
        }
      }, [navigation, parsedKebab]);

      const handleScroll = (event: any) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const contentOffset = event.nativeEvent.contentOffset.y; 
        const viewportHeight = event.nativeEvent.layoutMeasurement.height;
      
      
        if (contentOffset + viewportHeight >= contentHeight - 20) {
          setEndReached(true);
        } else {
          setEndReached(false);
        }
      };

    return (
      <ScrollView onScroll={handleScroll}>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding:20, backgroundColor:'#DCF2F1'}}>
        {parsedKebab ? (
        <>
            <View>
                <Image 
                source={{ uri: parsedKebab.logo_link }} 
                style={styles.image} 
                />
            </View>
            {(parsedKebab.pyszne_pl_review != null || parsedKebab.google_review != null) && (
                <View
                    style={{
                        flexDirection: 'row',
                        padding: 20,
                        backgroundColor: '#7fd2d9',
                        marginBottom:20,
                        borderRadius:30
                    }}
                >
                  {(parsedKebab.google_review != null) && (
                    <Text style={{ flex: 1 }}>⭐ Google: {parsedKebab.google_review}</Text>
                  )}
                  {(parsedKebab.pyszne_pl_review != null) && (
                    <Text>⭐ Pyszne: {parsedKebab.pyszne_pl_review}</Text>
                  )}
                </View>
            )}
            <View style={styles.doubleColumnContainer}>
                <View style={styles.columnLeft}>
                    <Text style={styles.boldDataText}> Informations: </Text>
                    <Text style={styles.dataText}>Name: {parsedKebab.name}</Text>
                    <Text style={styles.dataText}>Address: {parsedKebab.address}</Text>
                    <Text style={styles.dataText}>Opened: {parsedKebab.open_year}</Text>
                    <Text style={styles.dataText}>Closed: {parsedKebab.closed_year}</Text>
                    <Text style={styles.dataText}>Status: {parsedKebab.status}</Text>
                    <Text style={styles.dataText}>Craft: {parsedKebab.is_craft ? 'Yes' : 'No'}</Text>
                    <Text style={styles.dataText}>Building: {parsedKebab.building_type}</Text>
                    <Text style={styles.dataText}>Chain: {parsedKebab.is_chain ? 'Yes' : 'No'}</Text>
                    <Text style={styles.boldDataText}>Social medias:</Text>
                    <FlatList
                        data={parsedKebab.social_medias}
                        keyExtractor={(item: SocialMedia) => item.id.toString()}
                        renderItem={({ item }) => (
                          <View>
                            <TouchableOpacity onPress={() => handleLink(item.social_media_link)}>
                              <Text style={styles.link}>- {item.social_media_link}</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                        nestedScrollEnabled={true}
                    />
                </View>

                <View style={styles.columnRight}>
                    <View style={styles.row}>
                        <Text style={styles.dataText}>🍛 Sauces:</Text>
                        <FlatList
                            data={parsedKebab.sauces}
                            nestedScrollEnabled={true}
                            keyExtractor={(item: Sauce) => item.id.toString()}
                            renderItem={renderSauces}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text>🍗 Meats</Text>
                        <FlatList
                            data={parsedKebab.meat_types}
                            nestedScrollEnabled={true}
                            keyExtractor={(item: MeatType) => item.id.toString()}
                            renderItem={renderMeatType}
                        />
                    </View>
                </View>
              </View>

              <ScrollView horizontal={true} 
                        style={{ backgroundColor: '#72b4c4', maxHeight: 50 }}
                        contentContainerStyle={{ flexGrow: 0 }}
                      >
                  <View style={{flexDirection: 'row' }}>
                      <View style={styles.weekDaysContainer}>
                          <Text style={styles.weekDaysText}>Monday</Text>
                          <Text>{parsedKebab.opening_hour?.monday_open} - {parsedKebab.opening_hour?.monday_close}</Text>
                      </View>
                      <View style={styles.weekDaysContainer}>
                          <Text style={styles.weekDaysText}>Tuesday</Text>
                          <Text>{parsedKebab.opening_hour?.tuesday_open} - {parsedKebab.opening_hour?.tuesday_close}</Text>
                      </View>
                      <View style={styles.weekDaysContainer}>
                          <Text style={styles.weekDaysText}>Wednesday</Text>
                          <Text>{parsedKebab.opening_hour?.wednesday_open} - {parsedKebab.opening_hour?.wednesday_close}</Text>
                      </View>
                      <View style={styles.weekDaysContainer}>
                          <Text style={styles.weekDaysText}>Thursday</Text>
                          <Text>{parsedKebab.opening_hour?.thursday_open} - {parsedKebab.opening_hour?.thursday_close}</Text>
                      </View>
                      <View style={styles.weekDaysContainer}>
                          <Text style={styles.weekDaysText}>Friday</Text>
                          <Text>{parsedKebab.opening_hour?.friday_open} - {parsedKebab.opening_hour?.friday_close}</Text>
                      </View>
                      <View style={styles.weekDaysContainer}>
                          <Text style={styles.weekDaysText}>Saturday</Text>
                          <Text>{parsedKebab.opening_hour?.saturday_open} - {parsedKebab.opening_hour?.saturday_close}</Text>
                      </View>
                      <View style={styles.weekDaysContainer}>
                          <Text style={styles.weekDaysText}>Sunday </Text>
                          <Text>{parsedKebab.opening_hour?.sunday_open} - {parsedKebab.opening_hour?.sunday_close}</Text>
                      </View>
                  </View>
                </ScrollView>
                <View style={{
                        borderBottomLeftRadius: 30, 
                        borderBottomRightRadius: 30, 
                        alignItems: 'flex-start', 
                        width: '100%', 
                    }}>
                </View>
                  <FlatList
                            data={parsedKebab.order_way}
                            keyExtractor={(item: OrderWay) => item.id.toString()}
                            nestedScrollEnabled={true}
                            style={{borderBottomLeftRadius:30, borderBottomRightRadius:30}}
                            horizontal={true}
                            pagingEnabled={true}
                            renderItem={({ item }) => (
                            <View style={[styles.horizontalItemsContainer, { width: screenWidth }]}>
                            {item.app_name && (
                              <View>
                                <View style={styles.option}>
                                  <Text>📱 App: </Text>
                                  <Text>{item.app_name}</Text>
                                </View>
                              </View>
                            )}
                            {item.phone_number && 
                            (
                                  <View style={styles.option}>
                                    <Text>📞 Phone: </Text>
                                    <Text>{item.phone_number}</Text>
                                  </View>
                            )}
                            {item.website && 
                            (
                                <View style={styles.option}>
                                  <Text>🌐 Website: </Text>
                                  <TouchableOpacity onPress={() => handleLink(item.website)}>
                                    <Text style={styles.link}>{item.website}</Text>
                                  </TouchableOpacity>
                                </View>
                             )}
                              </View>
                            )}
                        />
                      <CommentsComponent kebabId={parsedKebab.id} endReached={endReached} />
        </>
      ) : (
        <Text>No Kebab Data Available</Text>
      )}
      </View>
      </ScrollView>
    );
  };

  const styles = StyleSheet.create({
    image: {
      width: 350,
      height: 350,
      resizeMode: 'contain', 
    },
    dataText: {
    }, 
    boldDataText: {
      fontWeight:'bold'
    }, 
    columnLeft: {
        flex: 2, 
        padding: 10,
        borderRightWidth: 0
      },
      columnRight: {
        flex: 1, 
        padding: 10,
      },
      row: {
        borderBottomWidth: 0, 
        paddingBottom: 10
      },
      doubleColumnContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#7FC7D9',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
      weekDaysText:{
        textAlign:'center',
        fontWeight:'bold'
      },
      weekDaysContainer:{
        margin:5
      },
      option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
      },
      link: {
        fontSize: 16,
        color: '#007BFF',
        textDecorationLine: 'underline',
      },
      phone: {
        fontSize: 16,
        color: '#333',
      },
      horizontalItemsContainer: {
        justifyContent: 'flex-start',
        flex:1,
        backgroundColor: '#7FC7D9',
      },
  });
  
  export default MoreView;