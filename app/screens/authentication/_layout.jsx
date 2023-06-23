import { Stack } from "expo-router";
import { AuthProvider } from "../../utils/context/auth";

export default function AuthLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Welcome">
                <Stack.Screen name="Welcome" options={{ headerShown: false }} />
                <Stack.Screen name="Login" />
                <Stack.Screen
                    name="ForgotPassword"
                    options={{ title: "Forgot Password" }}
                />
                <Stack.Screen name="SignUp" />
            </Stack>
        </AuthProvider>
    );
}
