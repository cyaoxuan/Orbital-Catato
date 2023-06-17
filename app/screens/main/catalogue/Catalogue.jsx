import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { cats } from "../../../data/CatTempData";
import { TouchableCatAvatar } from "../../../components/CatAvatar";

// Eventual Call from DB
function getCats() {
    return cats;
}

export default function Catalogue() {
    const navigation = useNavigation();

    return (
        <FlatList testID="catalogue"
            style={{ alignContent: "center" }}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            ListHeaderComponent={ <Text variant="headlineLarge" style={{ textAlign:"center", margin: 8 }}>Meet the Cats!</Text>}
            
            data={getCats()}
            renderItem={({item}) => {
                return (
                    <TouchableCatAvatar
                        size={200}
                        photoURL={item.photoURLs[0]}
                        variant="headlineLarge"
                        name={item.name}
                        // 
                        onPress={() => {
                            navigation.navigate("CatProfile", { catID: item.catID })
                        }}
                    />
                )
            }}
        />
    );
}