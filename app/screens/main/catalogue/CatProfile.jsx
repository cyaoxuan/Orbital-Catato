import { Text } from "react-native-paper";
import { Stack } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { cats } from "../../../data/CatTempData";
import { ScrollView } from "react-native";

export default function CatProfile() {
    const route = useRoute();
    return <CatProfileScreen catID={route.params.catID} />
}

export function CatProfileScreen({catID}) {
    const cat = cats.find((cat) => cat.catID === catID);

    if (!cat) {
        return (
            <ScrollView>
                <Text>Cat not found: {catID}</Text>
            </ScrollView>
        );
    };

    return (
        <>
            <Stack.Screen options={{ title: "Cat Profile", headerBackVisible: true }} />
            <Text>Cat: { cat.name }</Text>
        </>
    );
}