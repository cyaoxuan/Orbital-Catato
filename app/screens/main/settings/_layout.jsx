import { Stack } from "expo-router";
import { AuthProvider } from "../../../utils/context/auth";

export default function SettingsLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Settings">
                <Stack.Screen
                    name="Settings"
                    options={{
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="About"
                    options={{
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="FAQ"
                    options={{
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="Notifications"
                    options={{
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="AdminPanel"
                    options={{
                        title: "Admin Panel",
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
            </Stack>
        </AuthProvider>
    );
}
