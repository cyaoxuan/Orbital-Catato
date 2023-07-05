import { Stack } from "expo-router";
import { AuthProvider } from "../../../utils/context/auth";

export default function SettingsLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Settings">
                <Stack.Screen name="Settings" />
                <Stack.Screen name="About" />
                <Stack.Screen name="FAQ" />
                <Stack.Screen name="Notifications" />
                <Stack.Screen
                    name="AdminPanel"
                    options={{ title: "Admin Panel" }}
                />
            </Stack>
        </AuthProvider>
    );
}
