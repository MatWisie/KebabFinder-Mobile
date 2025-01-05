import { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { TimerPicker } from "react-native-timer-picker";

const DayHoursPicker = ({dayOfWeek, handleFromChanged, handleToChanged}:{dayOfWeek:string, handleFromChanged:(value:string) => void, handleToChanged:(value:string) => void}) => {
     const [fromEnabled, setFromEnabled] = useState(false);
     const [toEnabled, setToEnabled] = useState(false);
     const [fromValue, setFromValue] = useState("");
     const [toValue, setToValue] = useState("");

     const handleFromValueChange = (value: string) => {
        setFromValue(value);
        handleFromChanged?.(value); 
    };

    const handleToValueChange = (value:string) => {
        setToValue(value);
        handleToChanged?.(value);
    };

    const handleFromEnabledChanged = (value: boolean) =>{
        setFromEnabled(value);
        if(!value){
            setFromValue('');
            handleFromValueChange?.('');
        }
    }

    const handleToEnabledChanged = (value: boolean) =>{
        setToEnabled(value);
        if(!value){
            setToValue('');
            handleToChanged?.('');
        }
    }
     
    return (
        <View>
            <Text style={[styles.title,{maxWidth:200, marginRight:10}]}>{dayOfWeek}</Text>
            <View style={{flexDirection:'row'}}>
              <Text style={[styles.fromToTitle,{maxWidth:200, marginRight:10}]}>From</Text>
              <Switch value={fromEnabled} onValueChange={handleFromEnabledChanged}/>
            </View>
            {fromEnabled && (
                <TimerPicker hideSeconds onDurationChange={(value) => handleFromValueChange(`${value.hours.toString().padStart(2, '0')}:${value.minutes.toString().padStart(2, '0')}`)}/>
            )}
            <View style={{flexDirection:'row'}}>
              <Text style={[styles.fromToTitle,{maxWidth:200, marginRight:10}]}>To</Text>
              <Switch value={toEnabled} onValueChange={handleToEnabledChanged}/>
            </View>
            {toEnabled && (
                <TimerPicker hideSeconds onDurationChange={(value) => handleToValueChange(`${value.hours.toString().padStart(2, '0')}:${value.minutes.toString().padStart(2, '0')}`)}/>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { padding: 10 },
    title: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
    fromToTitle:{fontSize: 15, marginVertical: 10},
    item: { padding: 10, backgroundColor: "#eee", marginVertical: 5 },
    selectedItem: { backgroundColor: "#cce" },
    closeText: {fontSize: 20, fontWeight:'bold', alignSelf:'flex-end'},
    filterButtons:{marginTop:20}
});

export default DayHoursPicker;