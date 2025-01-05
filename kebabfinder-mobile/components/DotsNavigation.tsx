import { useEffect, useState } from "react";
import { View } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import Dots from "react-native-dots-pagination"


const DotsPagination = ({numberOfPages, onPageChange,}: {numberOfPages: number; onPageChange: (pageNumber: number) => void;}) => {
    const [pages, setPages] = useState<number>(numberOfPages);
    const [activePage, setActivePage] = useState<number>(0);

    const onComponentPageChange = (index: number) =>{
        onPageChange(index);
    }

    const changePage = (pageChange: number) => {
        let tmpPage = activePage + pageChange;
        if(tmpPage >= 0 && tmpPage <= pages){
            setActivePage(tmpPage);
        }
    }

    useEffect(() => {
        setPages(numberOfPages);
        setActivePage(0); 
    }, [numberOfPages]);

    return (
        <View style={{flexDirection:'row', alignSelf:'center'}}>
            <AntDesign name="caretleft" size={20} color="blue" onPress={() => changePage(-1)}/>
            <Dots length={pages} active={activePage} onScrollTo={onComponentPageChange}/>
            <AntDesign name="caretright" size={20} color="blue" onPress={() => changePage(+1)}/>
        </View>
    )
}

export default DotsPagination