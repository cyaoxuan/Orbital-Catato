import { Stack, useRouter } from "expo-router";
import { AuthProvider } from "../../utils/context/auth";
import { IconButton } from "react-native-paper";
import { allStyles } from "../../components/Styles";

export default function AuthLayout() {
    const router = useRouter();

    return (
        <AuthProvider>
            <Stack initialRouteName="Welcome">
                <Stack.Screen name="Welcome" options={{ headerShown: false }} />
                <Stack.Screen
                    name="Login"
                    options={{
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                        headerLeft: () => (
                            <IconButton
                                icon="arrow-left"
                                onPress={() => router.replace("/")}
                            />
                        ),
                    }}
                />
                <Stack.Screen
                    name="ForgotPassword"
                    options={{
                        title: "Forgot Password",
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="SignUp"
                    options={{
                        title: "Sign Up",
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                        headerLeft: () => (
                            <IconButton
                                icon="arrow-left"
                                onPress={() => router.replace("/")}
                            />
                        ),
                    }}
                />
            </Stack>
        </AuthProvider>
    );
}
