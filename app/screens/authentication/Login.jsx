import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth } from "../../context/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLoginWithEmail = () => {
        setLoading(true);

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
    }

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Login</Text>
            <Text>Sign in to continue</Text>
            <Text></Text>

            <Text>Email</Text>
            <TextInput
                autoCapitalize="none"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail} />

            <Text>Password</Text>
            <TextInput 
                autoCapitalize="none"
                secureTextEntry
                textContentType="password"
                value={password}
                onChangeText={setPassword} />

            <Button onPress={handleLoginWithEmail}>Log In</Button>
            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
            
            <Button onPress={() => router.push("./ForgotPassword")}>Forgot Password?</Button>
        </View>
    );
}
