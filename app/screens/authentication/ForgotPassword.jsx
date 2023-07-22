import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { auth } from "../../utils/context/auth";
import { AuthInput } from "../../components/TextInput";
import { PillButton } from "../../components/Button";
import { allStyles, primaryColor } from "../../components/Styles";
import { BodyText, ErrorText, TitleText } from "../../components/Text";
import { LoadingCat, SaladSmudgeCat } from "../../components/CatDrawing";

export default function ForgotPasswordScreen() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const handlePasswordReset = async () => {
        try {
            setLoading(true);
            setError(null);
            setEmailSent(false);

            await sendPasswordResetEmail(auth, email);

            setEmailSent(true);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError(error);
            setLoading(false);
        }
    };

    return (
        <View style={allStyles.centerFlexView}>
            <View style={{ alignItems: "center" }}>
                <LoadingCat size={150} />
            </View>

            <View>
                <TitleText variant="displaySmall" text="Forgot Password" />
                <BodyText
                    variant="titleSmall"
                    text="Please enter your email to reset your password"
                />
            </View>
            <View style={{ alignItems: "center", marginBottom: 150 }}>
                <AuthInput
                    label="Email"
                    iconName="mail-outline"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={setEmail}
                />

                <PillButton
                    label="Request Password Reset"
                    onPress={handlePasswordReset}
                    colorMode="primary"
                />

                {error && (
                    <>
                        <ErrorText variant="bodyMedium" text={error.message} />
                        <SaladSmudgeCat size={100} />
                    </>
                )}
                {loading && <ActivityIndicator color={primaryColor} />}
                {emailSent && (
                    <BodyText variant="bodyMedium" text="Email sent!" />
                )}
            </View>
        </View>
    );
}
