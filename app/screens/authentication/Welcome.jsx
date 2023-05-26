import { View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth } from "../../context/auth";
import { signInAnonymously } from "firebase/auth";
import { useState } from "react";

export default function WelcomeScreen() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onLoginPressed = () => {
        router.push("/screens/authentication/Login");
    };

    const onSignUpPressed = () => {
        router.push("/screens/authentication/SignUp");
    };

    const handleLoginAnonymously = () => {
        setLoading(true);
        signInAnonymously(auth)
            .then(() => {
                setLoading(false);
                router.replace("/screens/main/Dashboard");
            })
            .catch((error) => {
                console.error(error);
                setError(error);
                setLoading(false);
            });
    }

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Catato</Text>
            <Text>(Logo)</Text>
            <Button onPress={onLoginPressed}>Log In</Button>
            <Button onPress={onSignUpPressed}>Sign Up</Button>
            <Button onPress={handleLoginAnonymously}>Continue as Guest</Button>

            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
        </View>
    );
}
