import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { auth } from "../../utils/context/auth";
import { useNavigation } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { AuthInput, PasswordInput } from "../../components/TextInput";
import { PillButton } from "../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addUserPushToken } from "../../utils/db/user";

export default function SignUp() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();

    const handleSignUp = async () => {
        try {
            setLoading(true);
            setError(null);

            await createUserWithEmailAndPassword(auth, email, password); // Firebase Auth
            await updateProfile(auth.currentUser, { displayName: username }); // Set display name

            // Get push token from storage
            const token = await AsyncStorage.getItem("expoPushToken");
            if (token) {
                // Got token
                // console.log(token);
                addUserPushToken(auth.currentUser.uid, token);
            }

            setLoading(false);
            navigation.navigate("main", {
                screen: "Dashboard",
            });
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
            <Text variant="displayMedium">Sign Up</Text>
            <Text variant="displaySmall">Create an account</Text>

            <View style={{ justifyContent: "space-between" }}>
                <AuthInput
                    label="Username"
                    iconName="person"
                    placeholder="orbitee"
                    textContentType="username"
                    value={username}
                    onChangeText={setUsername}
                />

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

            <PillButton label="Sign Up" width="65%" onPress={handleSignUp} />

            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
        </View>
    );
}
