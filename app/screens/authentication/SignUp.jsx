import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { auth } from "../../context/auth";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { AuthInput, PasswordInput } from "../../components/TextInput"

export default function SignUpScreen() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignUp = () => {
        setLoading(true);

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

            <View style={{ justifyContent: "space-between" }}>
                <AuthInput label="Username"
                    iconName="person"
                    placeholder="orbitee"
                    textContentType="username"
                    value={username}
                    onChangeText={setUsername}
                />

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
            
            <Button onPress={handleSignUp}>Sign Up</Button>

            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
        </View>
    );
}
