import { View } from "react-native";
import { Text } from "react-native-paper";
import { Link } from "expo-router";

export default function HomePage() {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>CatAtO 🐱</Text>
            <Link href="/screens/dashboard">Continue as Guest</Link>
        </View>
    );
}
