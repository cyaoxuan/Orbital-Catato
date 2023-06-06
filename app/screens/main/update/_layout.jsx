import { Stack } from "expo-router";
import { AuthProvider } from "../../../context/auth"

export default function SettingsLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Update" />
        </AuthProvider>
    );
}