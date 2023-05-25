import { View } from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from "../../context/useAuth";

export default function Dashboard() {
    const { user } = useAuth();
    console.log("in Dashboard", user);

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Dashboard</Text>
        </View>
    );
}
