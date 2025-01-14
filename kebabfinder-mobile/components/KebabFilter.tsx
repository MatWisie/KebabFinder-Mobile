import { getUniqueFilterValues, resetDaysOfWeek } from "@/helpers/filterHelper";
import { FilterResult } from "@/interfaces/FilterTypes";
import { Kebab, OpeningHour } from "@/interfaces/KebabTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Switch, ScrollView } from "react-native"
import MultiStateSwitch from "./MultiStateSwitch";
import DayHoursPicker from "./DayHoursPicker";

const KebabFilter = ({ kebabs, onApply, onClose }:{kebabs: Kebab[], onApply:(filterResult: FilterResult) => void, onClose:() => void}) =>{
    const [selectedMeats, setSelectedMeats] = useState<string[]>([]);
    const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedBuildingTypes, setSelectedBuildingTypes] = useState<string[]>([]);
    const [selectedIsCraft, setSelectedIsCraft] = useState<boolean | null>(null);
    const [selectedIsChain, setSelectedIsChain] = useState<boolean | null>(null);
    const [selectedHasApp, setSelectedHasApp] = useState<boolean | null>(null);
    const [selectedHasPhone, setSelectedHasPhone] = useState<boolean | null>(null);
    const [selectedHasWebsite, setSelectedHasWebsite] = useState<boolean | null>(null);

    const [uniqueMeatTypes, setUniqueMeatTypes] = useState<string[]>([]);
    const [uniqueSauces, setUniqueSauces] = useState<string[]>([]);
    const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);
    const [uniqueBuildingTypes, setUniqueBuildingTypes] = useState<string[]>([]);

    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<OpeningHour>({
      id: 1,
      monday_open: null,
      monday_close: null,
      tuesday_open: null,
      tuesday_close: null,
      wednesday_open: null,
      wednesday_close: null,
      thursday_open: null,
      thursday_close: null,
      friday_open: null,
      friday_close: null,
      saturday_open: null,
      saturday_close: null,
      sunday_open: null,
      sunday_close: null,
    });

    const STORAGE_KEY = "kebabFilters";

    useEffect(() =>{
      const loadFilters = async () => {
        try {
            const savedFilters = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedFilters) {
                const filterResult: FilterResult = JSON.parse(savedFilters);
                setSelectedMeats(filterResult.filterSelectedMeats || []);
                setSelectedSauces(filterResult.filterSelectedSauces || []);
                setSelectedStatuses(filterResult.filterSelectedStatuses || []);
                setSelectedBuildingTypes(filterResult.filterSelectedBuildingTypes || []);
                setSelectedIsCraft(filterResult.filterIsCraft);
                setSelectedIsChain(filterResult.filterIsChain);
                setSelectedHasApp(filterResult.filterHasApp);
                setSelectedHasPhone(filterResult.filterHasPhone);
                setSelectedHasWebsite(filterResult.filterHasWebsite);
            }
        } catch (error) {
            console.error("Error loading filters:", error);
        }
      };
        const uniqueValues = getUniqueFilterValues(kebabs);
        setUniqueMeatTypes(uniqueValues.uniqueMeatTypes);
        setUniqueSauces(uniqueValues.uniqueSauces);
        setUniqueStatuses(uniqueValues.uniqueStatuses);
        setUniqueBuildingTypes(uniqueValues.uniqueBuildingTypes);
        loadFilters();
    },[])

    const resetFilters = () => {
      setSelectedMeats([]);
      setSelectedSauces([]);
      setSelectedStatuses([]);
      setSelectedBuildingTypes([]);
      setSelectedIsCraft(null);
      setSelectedIsChain(null);
      setSelectedHasApp(null);
      setSelectedHasPhone(null);
      setSelectedHasWebsite(null);
      setSelectedDayOfWeek(resetDaysOfWeek(selectedDayOfWeek));
    }

    const saveFilters = async (filterResult:FilterResult) => {
      try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filterResult));
      } catch (error) {
          console.error("Error saving filters:", error);
      }
  };

    const toggleSelection = (item: string, selectedItems: string[], setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>) => {
        setSelectedItems((prev) =>
          prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
      };

      return (
        <ScrollView>

          <View style={styles.container}>
              <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>X</Text>
              </TouchableOpacity>
            <Text style={styles.title}>Meat Types</Text>
            <FlatList
              data={uniqueMeatTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleSelection(item, selectedMeats, setSelectedMeats)}
                  style={[styles.item, selectedMeats.includes(item) && styles.selectedItem]}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Text style={styles.title}>Sauces</Text>
            <FlatList
              data={uniqueSauces}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleSelection(item, selectedSauces, setSelectedSauces)}
                  style={[styles.item, selectedSauces.includes(item) && styles.selectedItem]}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Text style={styles.title}>Statuses</Text>
            <FlatList
              data={uniqueStatuses}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleSelection(item, selectedStatuses, setSelectedStatuses)}
                  style={[styles.item, selectedStatuses.includes(item) && styles.selectedItem]}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />

          <Text style={styles.title}>Building type</Text>
            <FlatList
              data={uniqueBuildingTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleSelection(item, selectedBuildingTypes, setSelectedBuildingTypes)}
                  style={[styles.item, selectedBuildingTypes.includes(item) && styles.selectedItem]}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <Text style={styles.title}>Is craft</Text>
            <MultiStateSwitch onChange={(value) => setSelectedIsCraft(value)} value={selectedIsCraft}/>
            <Text style={styles.title}>Is chain</Text>
            <MultiStateSwitch onChange={(value) => setSelectedIsChain(value)} value={selectedIsChain}/>
            <Text style={styles.title}>App</Text>
            <MultiStateSwitch onChange={(value) => setSelectedHasApp(value)} value={selectedHasApp}/>
            <Text style={styles.title}>Phone</Text>
            <MultiStateSwitch onChange={(value) => setSelectedHasPhone(value)} value={selectedHasPhone}/>
            <Text style={styles.title}>Website</Text>
            <MultiStateSwitch onChange={(value) => setSelectedHasWebsite(value)} value={selectedHasWebsite}/>

            <DayHoursPicker 
                dayOfWeek="Monday"
                handleFromChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    monday_open: value, 
                  }));
                }} 
                handleToChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    monday_close: value, 
                  }));
                }} 
              />

              <DayHoursPicker 
                dayOfWeek="Tuesday" 
                handleFromChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    tuesday_open: value, 
                  }));
                }} 
                handleToChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    tuesday_close: value, 
                  }));
                }} 
              />

              <DayHoursPicker 
                dayOfWeek="Wednesday" 
                handleFromChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    wednesday_open: value, 
                  }));
                }} 
                handleToChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    wednesday_close: value, 
                  }));
                }} 
              />
              <DayHoursPicker 
                dayOfWeek="Thursday" 
                handleFromChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    thursday_open: value, 
                  }));
                }} 
                handleToChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    thursday_close: value, 
                  }));
                }} 
              />
              <DayHoursPicker 
                dayOfWeek="Friday" 
                handleFromChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    friday_open: value, 
                  }));
                }} 
                handleToChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    friday_close: value, 
                  }));
                }} 
              />
              <DayHoursPicker 
                dayOfWeek="Saturday" 
                handleFromChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    saturday_open: value, 
                  }));
                }} 
                handleToChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    saturday_close: value, 
                  }));
                }} 
              />
              <DayHoursPicker 
                dayOfWeek="Sunday" 
                handleFromChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    sunday_open: value, 
                  }));
                }} 
                handleToChanged={(value) => {
                  setSelectedDayOfWeek(prevState => ({
                    ...prevState,
                    sunday_close: value, 
                  }));
                }} 
              />
            <View style={styles.filterButtons}>
              <Button title="Apply filter" onPress={() => {
                const filterResult: FilterResult = {
                    filterSelectedMeats: selectedMeats,
                    filterSelectedSauces: selectedSauces,
                    filterSelectedStatuses: selectedStatuses,
                    filterSelectedBuildingTypes: selectedBuildingTypes,
                    filterIsCraft: selectedIsCraft,
                    filterIsChain: selectedIsChain,
                    filterHasApp: selectedHasApp,
                    filterHasPhone: selectedHasPhone,
                    filterHasWebsite: selectedHasWebsite,
                    filterDayOfWeek: selectedDayOfWeek
                };
                saveFilters(filterResult);
                onApply(filterResult)}
                } />
            </View>
              <View style={styles.filterButtons}>
                <Button title="Clear filter" onPress={() => {
                  resetFilters();
                }}/>
              </View>
          </View>
        </ScrollView>
      );
    };
    
    const styles = StyleSheet.create({
      container: { padding: 10 },
      title: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
      item: { padding: 10, backgroundColor: "#eee", marginVertical: 5 },
      selectedItem: { backgroundColor: "#cce" },
      closeText: {fontSize: 20, fontWeight:'bold', alignSelf:'flex-end'},
      filterButtons:{marginTop:20}
    });
    
export default KebabFilter;