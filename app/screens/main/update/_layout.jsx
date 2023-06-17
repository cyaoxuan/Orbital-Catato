import { Stack } from "expo-router";
import { AuthProvider } from "../../../utils/context/auth"

export default function SettingsLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Update">
                <Stack.Screen name="Update" />
                <Stack.Screen name="SelectCat" options={{ title: "Select Cat" }} />
                <Stack.Screen name="UpdateOptions" />
                <Stack.Screen name="Form" />
                <Stack.Screen name="ConfirmUpdate" options={{ headerBackVisible: false, title: "Confirm Update" }} />
            </Stack>
        </AuthProvider>
    );
}