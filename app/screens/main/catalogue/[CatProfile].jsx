import { Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";

export default function CatProfile() {
    const { catName, cat } = useLocalSearchParams();
    return (
        <Text>Cat: { cat.catName }</Text>
    );
}