import { Stack } from "expo-router";
import { AuthProvider } from "../../context/auth"

export default function AuthLayout() {
    return (
        <AuthProvider>
            <Stack />
        </AuthProvider>
    );
}