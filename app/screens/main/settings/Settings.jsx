import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Divider, List, Switch, Text } from "react-native-paper";
import { auth, useAuth } from "../../../context/auth";
import { useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { PillButton } from "../../../components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";

const SettingsOptionList = () => {
    const [valueNotif, setValueNotif] = useState(false);
    const navigation = useNavigation();

    return (
        <List.Section>
            <List.Item  
                title="Reset Password"
                titleStyle={styles.title}
                onPress={() => {}}
                left={() => <List.Icon icon={() => <Ionicons name="lock-closed" size={24} />} />}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="FAQs"
                titleStyle={styles.title}
                onPress={() => {}}
                left={() => <List.Icon icon={() => <Ionicons name="help-circle" size={24} />} />}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                bottomDivider
                title="Notifications"
                titleStyle={styles.title}
                left={() => <List.Icon icon={() => <Ionicons name="notifications" size={24} />} />}
                right={() => <Switch style={{ transform:[{ scaleX: 1.5 }, { scaleY: 1.5 }] }} 
                    value={valueNotif} 
                    onValueChange={setValueNotif} 
                />}
            />
            <Divider />
            <List.Item 
                title="Documentation"
                titleStyle={styles.title}
                onPress={() => {}}
                left={() => <List.Icon icon={() => <Ionicons name="paper-plane" size={24} />} />}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
        </List.Section>
    );
}

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

const styles = StyleSheet.create({
    title: {
        fontSize: 24
    }
})