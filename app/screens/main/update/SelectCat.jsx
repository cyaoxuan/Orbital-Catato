import { FlatList, View } from "react-native"
import { Stack, useNavigation } from "expo-router";
import { cats } from "../../../data/CatTempData";
import { CatCardSimple } from "../../../components/CatCard";

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
            data={cats}
            renderItem={({item}) => {
                return (
                    <View key={item.catId}>
                        <CatCardSimple cat={item} 
                            onPress={() => {
                                item.catID === 0
                                    ? navigation.navigate("Form", { catID: item.catID, formType: "create" })
                                    : navigation.navigate("Update", { catID: item.catID })
                            }}/>
                    </View>
                );
            }}
        />
        </>
    )
}