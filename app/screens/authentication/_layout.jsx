import { Stack } from "expo-router";
import { AuthProvider } from "../../utils/context/auth"

export default function AuthLayout() {
    return (
        <AuthProvider>
            <Stack />
        </AuthProvider>
    );
}