import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { auth } from "../../utils/context/auth";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { AuthInput, PasswordInput } from "../../components/TextInput";
import { PillButton } from "../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addUserPushToken } from "../../utils/db/user";
import { allStyles, primaryColor } from "../../components/Styles";
import { BodyText, ErrorText, TitleText } from "../../components/Text";

export default function SignUp() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

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
            router.replace("/screens/main/Dashboard");
        } catch (error) {
            console.error(error);
            setError(error);
            setLoading(false);
        }
    };

    return (
        <View style={allStyles.centerFlexView}>
            <View>
                <TitleText variant="displayMedium" text="Sign Up" />
                <BodyText variant="displaySmall" text="Create an account" />
            </View>

            <View style={{ justifyContent: "space-between", paddingBottom: 8 }}>
                <AuthInput
                    label="Username"
                    iconName="person-outline"
                    textContentType="username"
                    value={username}
                    onChangeText={setUsername}
                />

                <AuthInput
                    label="Email"
                    iconName="mail-outline"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={setEmail}
                />

                <PasswordInput
                    label="Password"
                    iconName="lock-closed-outline"
                    textContentType="password"
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <PillButton
                label="Sign Up"
                onPress={handleSignUp}
                colorMode="primary"
            />

            {error && <ErrorText variant="bodyMedium" text={error.message} />}
            {loading && <ActivityIndicator color={primaryColor} />}
        </View>
    );
}
