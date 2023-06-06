import { View } from "react-native";
import { ActivityIndicator, Avatar, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth } from "../../context/auth";
import { signInAnonymously } from "firebase/auth";
import { useState } from "react";
import { PillButton } from "../../components/Button";

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
        setError(null);
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
    };

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text variant="displayLarge">Catato</Text>

            <Avatar.Text style={{ backgroundColor: "transparent", borderWidth: 1, margin: 20 }}
                labelStyle={{ color: "black", fontSize: 32 }}
                label="Logo" 
                size={300} />
          
            <PillButton mode="outlined"
                width="60%" 
                label="Log In" 
                onPress={onLoginPressed} />
            
            <PillButton mode="outlined"
                width="60%" 
                label="Sign Up" 
                onPress={onSignUpPressed} />
            
            <PillButton mode="text"
                width="40%"
                label="Continue as Guest"
                onPress={handleLoginAnonymously} />

            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
        </View>
    );
}
