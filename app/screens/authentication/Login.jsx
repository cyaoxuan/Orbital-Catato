import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth } from "../../context/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthInput, PasswordInput } from "../../components/TextInput"

export default function LoginScreen() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLoginWithEmail = () => {
        setLoading(true);
        setError(null);

        signInWithEmailAndPassword(auth, email, password)
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
            <Text>Login</Text>
            <Text>Sign in to continue</Text>
            <Text></Text>

            <View style={{ justifyContent: "space-between" }}>
                <AuthInput label="Email"
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
            
            

            <Button onPress={handleLoginWithEmail}>Log In</Button>
            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
            
            <Button onPress={() => router.push("./ForgotPassword")}>Forgot Password?</Button>
        </View>
    );
}
