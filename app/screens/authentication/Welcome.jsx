import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/useAuth";

export default function WelcomeScreen() {
    const router = useRouter();
    const { loginAnonymously } = useAuth();

    const onLoginPressed = () => {
        router.push("/screens/authentication/Login");
    };

    const onSignUpPressed = () => {
        router.push("/screens/authentication/SignUp");
    };

    const onGuestPressed = () => {
        loginAnonymously()
            .then(() => router.push("/screens/main/Dashboard"));
    };

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Catato</Text>
            <Text>(Logo)</Text>
            <Button onPress={onLoginPressed}>Log In</Button>
            <Button onPress={onSignUpPressed}>Sign Up</Button>
            <Button onPress={onGuestPressed}>Continue as Guest</Button>
        </View>
    );
}
