import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { cats } from "../../../data/CatTempData";
import { TouchableCatAvatar } from "../../../components/CatAvatar";

export default function Catalogue() {
    const navigation = useNavigation();

    return (
        <FlatList style={{ alignContent: "center" }}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            ListHeaderComponent={<Text variant="headlineLarge">Meet the Cats!</Text>}
            
            data={cats.filter(cat => cat.catID != 0)}
            renderItem={({item}) => {
                return (
                    <TouchableCatAvatar size={200}
                        photoURL={item.photoURL}
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