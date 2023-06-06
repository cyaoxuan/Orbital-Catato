import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { auth } from "../../context/auth";
import { AuthInput } from "../../components/TextInput"
import { PillButton } from "../../components/Button";

export default function ForgotPasswordScreen() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const router = useRouter();

    const handlePasswordReset = () => {
        setLoading(true);
        setError(null);
        setEmailSent(false);
        
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setEmailSent(true);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setError(error);
                setLoading(false);
            });
    };

    const onLoginPressed = () => {
        router.push("/screens/authentication/Login");
    };

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text variant="displayMedium">Forgot Password</Text>
            <Text variant="titleMedium">Please enter your email to reset your password</Text>
            <Text></Text>

            <AuthInput label="Email"
                    iconName="mail"
                    placeholder="orbitee@kitty.xyz"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={setEmail}
                />
            
            <PillButton mode="outlined"
                width="60%"
                label="Request Password Reset" 
                onPress={handlePasswordReset} />

            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
            {emailSent && <Text>Email sent!</Text>}
        </View>
    );
}
