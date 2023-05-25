import { AuthProvider, useAuth } from "./context/useAuth";
import WelcomeScreen from "./screens/authentication/Welcome";
import Dashboard from "./screens/main/dashboard";

export default function RootNavigation() {
    console.log("in RootNav");
    const { user } = useAuth();

    return <AuthProvider>{user ? <Dashboard /> : <WelcomeScreen />}</AuthProvider>;
}
