import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { cats } from "../../../data/CatTempData";
import { TouchableCatAvatar } from "../../../components/CatAvatar";

export default function Catalogue() {
    const router = useRouter();

    return (
        <FlatList style={{ alignContent: "center" }}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            ListHeaderComponent={<Text variant="headlineLarge">Meet the Cats!</Text>}
            
            data={cats}
            renderItem={({item}) => {
                return (
                    <TouchableCatAvatar size={200}
                        image={item.photoURL}
                        variant="headlineLarge"
                        catName={item.name}
                        // 
                        onPress={() => {
                            router.push({ pathname: `screens/main/catalogue/${item.name}`, params: { cat: item } });
                        }}
                    />
                )
            }}
        />
    );
}