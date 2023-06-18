import { FlatList, View } from "react-native"
import { useNavigation } from "expo-router";
import { cats } from "../../../data/CatTempData";
import { CatCardSimple } from "../../../components/CatCard";
import { getItemWidth } from "../../../utils/calculateItemWidths";

// Eventual Call from DB
function getCats() {
    return cats;
}

export default function SelectCat() {
    const navigation = useNavigation();

    const cardWidth = getItemWidth(2, 8);
    return (
        <FlatList style={{ flex: 1 }}
            contentContainerStyle={{ justifyContent: "space-around" }}
            columnWrapperStyle={{ flexShrink: 1 }}
            numColumns={2}
            data={getCats()}
            renderItem={({item}) => {
                // Remove Date properties
                const partialCat = (({catID, name, photoURLs, gender, birthYear, sterilised, keyFeatures, concernStatus, concernDesc}) => 
                ({catID, name, photoURLs, gender, birthYear, sterilised, keyFeatures, concernStatus, concernDesc}))(item); 

                return (
                    <View key={item.catId}>
                        <CatCardSimple
                            name={item.name}
                            photoURL={item.photoURLs[0]}
                            cardWidth={cardWidth}
                            onPress={() => {navigation.navigate("Update", 
                                { cat: partialCat })
                            }}/>
                    </View>
                );
            }}
        />
    )
}