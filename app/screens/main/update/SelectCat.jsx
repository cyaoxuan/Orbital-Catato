import { FlatList, View } from "react-native"
import { Stack, useNavigation } from "expo-router";
import { cats } from "../../../data/CatTempData";
import { CatCardSimple } from "../../../components/CatCard";
import { getItemWidth } from "../../../utils/CalculateDimensions";

// Eventual Call from DB
function getCats() {
    return cats;
}

export default function SelectCat() {
    const navigation = useNavigation();

    const cardWidth = getItemWidth(2, 4);
    return (
        <>
        <Stack.Screen options={{ title: "Select Cat" }} />
        <FlatList
            numColumns={2}
            contentContainerStyle={{ justifyContent: "space-around" }}
            data={getCats()}
            renderItem={({item}) => {
                return (
                    <View key={item.catId}>
                        <CatCardSimple
                            name={item.name}
                            photoURL={item.photoURLs[0]}
                            cardWidth={cardWidth}
                            onPress={() => {navigation.navigate("Update", 
                                { catID: item.catID, name: item.name, photoURL: item.photoURLs[0] })
                            }}/>
                    </View>
                );
            }}
        />
        </>
    )
}