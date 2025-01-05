import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

const MultiStateSwitch = ({onChange, value}: {onChange:(value:boolean|null)=>void, value:boolean|null}) => {
  const [state, setState] = useState<boolean|null>(value); 

    useEffect(() => {
    setState(value);
    }, [value]);

  const toggleState = () => {
    let tmpState : boolean | null = null;
    if(state == null) tmpState = true;
    if(state == true) tmpState = false;
    if(state == false) tmpState = null;
    setState(tmpState);
    onChange(tmpState);
  };

  const getStateLabel = () => {
    switch (state) {
      case null:
        return '';
      case true:
        return '✔️';
      case false:
        return '❌';
      default:
        return '';
    }
  };

  return (
    <View style={{width:45}}>
      <TouchableOpacity onPress={toggleState} style={{ paddingTop: 10, paddingBottom:10, backgroundColor: 'lightgray', borderRadius:50 }}>
        <Text style={{alignContent:'center', alignSelf:'center'}}>{getStateLabel()}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MultiStateSwitch;