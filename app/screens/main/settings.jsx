import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../../context/useAuth";
import { useRouter } from "expo-router";

export default function Settings() {
    const router = useRouter();
    const { user, logout } = useAuth();

    console.log(user);

    const onLogoutPress = () => {
        logout().then(() => {
            router.push("../authentication/Welcome");
        });
    };

    // ISSUE: if user check is not present, logout does not work because user is set to null -> react tries to rerender
    // TODO: remove checks eventually 
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontWeight: "bold" }}>Settings</Text>
            <Text>User: {user ? user.uid : "None"}</Text>
            <Text>Is Guest: {user ? String(user.isAnonymous) : "None"}</Text>
            <Button onPress={onLogoutPress}>Logout</Button>
        </View>
    );
}
