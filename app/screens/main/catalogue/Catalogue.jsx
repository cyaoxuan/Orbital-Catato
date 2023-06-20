import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { cats } from "../../../data/CatTempData";
import { TouchableCatAvatar } from "../../../components/CatAvatar";
import { useGetAllCats } from "../../../utils/db/cat";
import { useEffect } from "react";

export default function Catalogue() {
    const navigation = useNavigation();
    const { getAllCats, allCats, loading, error } = useGetAllCats();

    useEffect(() => {
        const fetchData = async () => {
            await getAllCats();
        }
        
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <FlatList testID="catalogue"
            style={{ alignContent: "center" }}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            ListHeaderComponent={ <Text variant="headlineLarge" style={{ textAlign:"center", margin: 8 }}>Meet the Cats!</Text>}
            
            data={allCats}
            renderItem={({item}) => {
                return (
                    <TouchableCatAvatar
                        size={200}
                        photoURL={item.photoURLs ? item.photoURLs[0] : null}
                        variant="headlineLarge"
                        name={item.name}
                        onPress={() => {
                            navigation.navigate("CatProfile", { catID: item.catID })
                        }}
                    />
                )
            }}
        />
    );
}