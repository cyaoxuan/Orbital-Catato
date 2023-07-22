import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth } from "../../utils/context/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthInput, PasswordInput } from "../../components/TextInput";
import { PillButton, TextButton } from "../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addUserPushToken } from "../../utils/db/user";
import { allStyles, primaryColor } from "../../components/Styles";
import { BodyText, ErrorText, TitleText } from "../../components/Text";
import { PantingCat, SaladSmudgeCat } from "../../components/CatDrawing";

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

            await signInWithEmailAndPassword(auth, email, password); // Firebase auth

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
                <TitleText variant="displayMedium" text="Login" />
                <BodyText variant="displaySmall" text="Sign in to continue" />
            </View>

            <View style={{ justifyContent: "space-between", paddingBottom: 8 }}>
                <AuthInput
                    label="Email"
                    iconName="mail-outline"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={setEmail}
                />

                <PasswordInput
                    iconName="lock-closed-outline"
                    label="Password"
                    textContentType="password"
                    value={password}
                    onChangeText={setPassword}
                />
            </View>
            <PillButton
                label="Log In"
                onPress={handleLoginWithEmail}
                colorMode="primary"
            />

            {error && (
                <>
                    <ErrorText variant="bodyMedium" text={error.message} />
                    <SaladSmudgeCat size={100} />
                </>
            )}
            {loading && <ActivityIndicator color={primaryColor} />}

            <TextButton
                label="Forgot Password?"
                onPress={() => router.push("./ForgotPassword")}
            />
        </View>
    );
}
