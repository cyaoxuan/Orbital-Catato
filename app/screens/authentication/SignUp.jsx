import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { auth } from "../../context/auth";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function SignUpScreen() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignUp = () => {
        setLoading(true);
        setError(null);

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                const currentUser = auth.currentUser;
                updateProfile(currentUser, { displayName: username })
                    .then(() => {
                        setLoading(false);
                        router.replace("/screens/main/Dashboard");
                    })
                    .catch((error) => {
                        console.error(error);
                        setError(error);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.error(error);
                setError(error);
                setLoading(false);
            });
    };

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Sign Up</Text>
            <Text>Create an account</Text>
            <Text></Text>

            <Text>Username</Text>
            <TextInput 
                autoCapitalize="none"
                textContentType="username"
                value={username}
                onChangeText={setUsername} />

            <Text>Email</Text>
            <TextInput 
                autoCapitalize="none"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail} />

            <Text>Password</Text>
            <TextInput 
                secureTextEntry
                autoCapitalize="none"
                textContentType="password"
                value={password}
                onChangeText={setPassword} />
            
            <Button onPress={handleSignUp}>Sign Up</Button>

            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
        </View>
    );
}
