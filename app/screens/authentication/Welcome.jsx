import { View } from "react-native";
import { ActivityIndicator, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth, useAuth } from "../../utils/context/auth";
import { signInAnonymously } from "firebase/auth";
import { useEffect, useState } from "react";
import { PillButton, TextButton } from "../../components/Button";
import { ErrorText, TitleText } from "../../components/Text";
import { allStyles, primaryColor } from "../../components/Styles";
import { SaladSmudgeCat } from "../../components/CatDrawing";

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

    useEffect(() => {
        if (user) {
            router.replace("/screens/main/Dashboard");
        }
    }, [router, user]);

    return (
        <View style={allStyles.centerFlexView}>
            <TitleText variant="displayMedium" text={"Welcome!"} />

            <Avatar.Image
                style={{ backgroundColor: "transparent", margin: 12 }}
                source={require("../../../assets/catato-logo.png")}
                size={320}
            />

            <PillButton
                label="Log In"
                onPress={onLoginPressed}
                colorMode="primary"
            />

            <PillButton
                label="Sign Up"
                onPress={onSignUpPressed}
                colorMode="primary"
            />

            <TextButton
                label="Continue as Guest"
                onPress={handleLoginAnonymously}
            />

            {error && (
                <>
                    <ErrorText variant="bodyMedium" text={error.message} />
                    <SaladSmudgeCat size={100} />
                </>
            )}
            {loading && <ActivityIndicator color={primaryColor} />}
        </View>
    );
}
