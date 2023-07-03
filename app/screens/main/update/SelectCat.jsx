import { FlatList, View } from "react-native";
import { useNavigation } from "expo-router";
import { CatCardSimple } from "../../../components/CatCard";
import { getItemWidthCols } from "../../../utils/calculateItemWidths";
import { useGetAllCats } from "../../../utils/db/cat";
import { useEffect } from "react";

export default function SelectCat() {
    const navigation = useNavigation();
    const { getAllCats, allCats, loading, error } = useGetAllCats();

    useEffect(() => {
        const fetchData = async () => {
            await getAllCats();
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cardWidth = getItemWidthCols(2, 8);
    return (
        <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ justifyContent: "space-around" }}
            columnWrapperStyle={{ flexShrink: 1 }}
            numColumns={2}
            data={allCats}
            renderItem={({ item }) => {
                // Remove Date properties
                const partialCat = (({
                    catID,
                    name,
                    photoURLs,
                    gender,
                    birthYear,
                    sterilised,
                    keyFeatures,
                    concernStatus,
                    concernDesc,
                    isFostered,
                    fosterReason,
                }) => ({
                    catID,
                    name,
                    photoURLs,
                    gender,
                    birthYear,
                    sterilised,
                    keyFeatures,
                    concernStatus,
                    concernDesc,
                    isFostered,
                    fosterReason,
                }))(item);

                return (
                    <View key={item.catId}>
                        <CatCardSimple
                            name={item.name}
                            photoURL={item.photoURLs ? item.photoURLs[0] : null}
                            cardWidth={cardWidth}
                            onPress={() => {
                                navigation.navigate("UpdateOptions", {
                                    ...partialCat,
                                });
                            }}
                        />
                    </View>
                );
            }}
        />
    );
}
