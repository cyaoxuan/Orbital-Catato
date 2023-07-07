import { View } from "react-native";
import { ActivityIndicator, Avatar, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth, useAuth } from "../../utils/context/auth";
import { signInAnonymously } from "firebase/auth";
import { useState } from "react";
import { PillButton } from "../../components/Button";

export default function WelcomeScreen() {
    const { user } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onLoginPressed = () => {
        router.push("/screens/authentication/Login");
    };

    const onSignUpPressed = () => {
        router.push("/screens/authentication/SignUp");
    };

    const handleLoginAnonymously = async () => {
        try {
            setLoading(true);
            setError(null);

            await signInAnonymously(auth); // Firebase Auth

            setLoading(false);
            router.replace("/screens/main/Dashboard");
        } catch (error) {
            console.error(error);
            setError(error);
            setLoading(false);
        }
    };

    if (user) {
        router.replace("/screens/main/Dashboard");
    }

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
            }}
        >
            <Text variant="displayMedium">Welcome</Text>

            <Avatar.Image
                style={{ backgroundColor: "transparent", margin: 20 }}
                source={require("../../../assets/catato-logo.png")}
                size={350}
            />

            <PillButton label="Log In" width="65%" onPress={onLoginPressed} />

            <PillButton label="Sign Up" width="65%" onPress={onSignUpPressed} />

            <PillButton
                mode="text"
                label="Continue as Guest"
                onPress={handleLoginAnonymously}
            />

            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
        </View>
    );
}
