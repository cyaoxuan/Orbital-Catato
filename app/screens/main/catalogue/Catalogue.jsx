import { FlatList, RefreshControl, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { TouchableCatAvatar } from "../../../components/CatAvatar";
import { useCallback, useEffect , useState } from "react";
import { useGetAllCats } from "../../../utils/db/cat";

export default function Catalogue() {
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const { getAllCats, allCats, loading, error } = useGetAllCats();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 500);
      }, []);

    useEffect(() => {
        const fetchData = async () => {
            await getAllCats();
        }
        
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshing]);

    return (
            <FlatList testID="catalogue"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ width: "100%" }}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            ListHeaderComponent={ <View>
                <Text variant="headlineLarge" style={{ textAlign:"center", margin: 8 }}>Meet the Cats!</Text>
                {(error[0]) && <Text>Error: {error[0].message}</Text>}
                {(loading[0]) && <ActivityIndicator />}
                </View>}
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