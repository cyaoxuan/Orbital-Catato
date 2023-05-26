import { View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { auth, useAuth } from "../../context/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { signOut } from "firebase/auth";

export default function Settings() {
    const { user } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        setLoading(true);
        signOut(auth)
            .then(() => {
                setLoading(false);
                router.replace("/screens/authentication/Welcome");
            })
            .catch((error) => {
                console.error(error);
                setError(error);
                setLoading(false);
            });
    };

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontWeight: "bold" }}>Settings</Text>
            <Text>Username: {user ? (user.displayName ? user.displayName : "__GUEST__") : "None"}</Text>
            <Text>User ID: {user ? user.uid : "None"}</Text>
            <Text>Is Guest: {user ? String(user.isAnonymous) : "None"}</Text>
            <Button onPress={handleLogout}>Logout</Button>

            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
        </View>
    );
}
