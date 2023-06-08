import { Dimensions, FlatList, View } from "react-native"
import { Stack, useNavigation } from "expo-router";
import { cats } from "../../../data/CatTempData";
import { CatCardSimple } from "../../../components/CatCard";

// Calculate card width based on phone screen dimensions
function getCardWidth() {
    const {height, width} = Dimensions.get("window");
    // Card is 3/4 the width of a screen - margins
    const cardWidth = (width) / 2;
    return cardWidth;
}

// Eventual Call from DB
function getCats() {
    return cats;
}

export default function SelectCat() {
    const navigation = useNavigation();
    return (
        <>
        <Stack.Screen options={{
            title: "Select Cat"
        }} />
        <FlatList
            numColumns={2}
            contentContainerStyle={{ justifyContent: "space-around" }}
            data={getCats()}
            renderItem={({item}) => {
                return (
                    <View key={item.catId}>
                        <CatCardSimple cat={item}
                            cardWidth={getCardWidth()}
                            onPress={() => {navigation.navigate("Update", 
                                { catID: item.catID, name: item.name, photoURL: item.photoURL })
                            }}/>
                    </View>
                );
            }}
        />
        </>
    )
}