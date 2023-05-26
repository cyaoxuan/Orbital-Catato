import { View } from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from "../../context/auth";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Dashboard</Text>
        </View>
    );
}
