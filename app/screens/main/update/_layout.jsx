import { Stack } from "expo-router";
import { AuthProvider } from "../../../utils/context/auth";

export default function SettingsLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Update">
                <Stack.Screen
                    name="Update"
                    options={{
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="SelectCat"
                    options={{
                        title: "Select Cat",
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="UpdateOptions"
                    options={{
                        title: "Update Options",
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="Form"
                    options={{
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="ConfirmUpdate"
                    options={{
                        title: "Confirm Update",
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                        headerBackVisible: false,
                    }}
                />
            </Stack>
        </AuthProvider>
    );
}
