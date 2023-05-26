import { Slot } from "expo-router";
import { AuthProvider } from "../../context/useAuth";

export default function AuthLayout() {
    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    )
}