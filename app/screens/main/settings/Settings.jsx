import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { auth, useAuth } from "../../../context/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { PillButton } from "../../../components/Button";
import { SettingsOptionList } from "../../../components/OptionList";


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
        <View style={{ flex: 1 }}>
            <Text variant="headlineLarge">Settings</Text>
            <View style={{ flex: 1 }}>
                <Text variant="titleMedium" style={{ padding: 8 }}>Username: {user ? (user.displayName ? user.displayName : "__GUEST__") : "None"}</Text>
                <Text variant="titleMedium" style={{ padding: 8 }}>User ID: {user ? user.uid : "None"}</Text>
                <Text variant="titleMedium" style={{ padding: 8 }}>Is Guest: {user ? String(user.isAnonymous) : "None"}</Text>
            </View>

            <View style={{ flex: 2, margin: 16 }}>
                <SettingsOptionList />
            </View>

            <View style={{ alignItems: "center" }}>
                <PillButton mode="outlined"
                    width="60%"
                    label="Log Out"
                    onPress={handleLogout} />
            </View>

            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
        </View>
    );
}
