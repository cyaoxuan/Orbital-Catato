import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth } from "../../utils/context/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthInput, PasswordInput } from "../../components/TextInput";
import { PillButton } from "../../components/Button";

export default function LoginScreen() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLoginWithEmail = async () => {
        try {
            setLoading(true);
            setError(null);

            await signInWithEmailAndPassword(auth, email, password);

            setLoading(false);
            router.replace("/screens/main/Dashboard");
        } catch (error) {
            console.error(error);
            setError(error);
            setLoading(false);
        }
    };

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Text variant="displayMedium">Login</Text>
            <Text variant="displaySmall">Sign in to continue</Text>

            <View style={{ justifyContent: "space-between" }}>
                <AuthInput
                    label="Email"
                    iconName="mail"
                    placeholder="orbitee@kitty.xyz"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={setEmail}
                />

                <PasswordInput
                    iconName="lock-closed"
                    label="Password"
                    textContentType="password"
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <PillButton
                label="Log In"
                width="65%"
                onPress={handleLoginWithEmail}
            />

            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}

            <PillButton
                mode="text"
                label="Forgot Password?"
                onPress={() => router.push("./ForgotPassword")}
            />
        </View>
    );
}
