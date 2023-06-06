import { AuthProvider, useAuth } from "./utils/context/auth";
import Dashboard from "./screens/main/Dashboard"
import WelcomeScreen from "./screens/authentication/Welcome";

export const unstable_settings = {
    // Ensure any route can link back to `/`
    initialRouteName: "index",
};

export default function RootNavigation() {
    const { user } = useAuth();

    return (
        <AuthProvider>
            {user ? <Dashboard /> : <WelcomeScreen />}
        </AuthProvider>
    );
}
