import { Kebab } from '@/interfaces/KebabTypes';
import { Picker } from '@react-native-picker/picker';
import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const SortPicker = ({ sortByChanged }: { sortByChanged: (sortValue: keyof Kebab, isDescending: boolean) => void }) => {
  const kebabKeys: (keyof Kebab)[] = ['name', 'open_year', 'closed_year', 'google_review', 'pyszne_pl_review'];

  const [selectedOption, setSelectedOption] = useState<keyof Kebab>('name'); 
  const [descending, setDescending] = useState(false);

  const onSelectedSortChanged = (item: keyof Kebab, descendingParam: boolean | null = null) => {
    if(descendingParam == null){
        descendingParam = descending;
    }

    if (kebabKeys.includes(item)) {
      setSelectedOption(item); 
      sortByChanged(item, descendingParam); 
    }
  };

  return (
    <View>
        <View style={{flexDirection:'row'}}>
            <Picker style={{width:130}}
            selectedValue={selectedOption} 
            onValueChange={(itemValue: keyof Kebab) => onSelectedSortChanged(itemValue)} 
            enabled={true}
            >
            <Picker.Item label="Name" value="name" />
            <Picker.Item label="Year Opened" value="open_year" />
            <Picker.Item label="Year Closed" value="closed_year" />
            <Picker.Item label="Google Review" value="google_review" />
            <Picker.Item label="Pyszne Review" value="pyszne_pl_review" />
            </Picker>
            <View style={{justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => 
                    {
                        onSelectedSortChanged(selectedOption, !descending)
                        setDescending(!descending);
                    }}>
                    {descending && 
                        <FontAwesome5 name="sort-amount-up" size={20} color="black" />
                    }
                    {!descending &&
                        <FontAwesome5 name="sort-amount-down" size={20} color="black" />
                    }
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
};

export default SortPicker;