import { Stack } from "expo-router";
import { AuthProvider } from "../../../utils/context/auth"

export default function SettingsLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Update" />
        </AuthProvider>
    );
}