import { FlatList, RefreshControl, View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { cats } from "../../../data/CatTempData";
import { TouchableCatAvatar } from "../../../components/CatAvatar";
import { useCallback, useState } from "react";

// Eventual Call from DB
function getCats() {
    return cats;
}

export default function Catalogue() {
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
      }, []);


    return (
        <FlatList testID="catalogue"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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