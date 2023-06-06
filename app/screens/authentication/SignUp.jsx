import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { auth } from "../../context/auth";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { AuthInput, PasswordInput } from "../../components/TextInput"
import { PillButton } from "../../components/Button";

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
            <Text variant="displayMedium">Sign Up</Text>
            <Text variant="displaySmall">Create an account</Text>

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
            
            <PillButton mode="outlined"
                width="60%"
                label="Sign Up" 
                onPress={handleSignUp} />

            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
        </View>
    );
}
