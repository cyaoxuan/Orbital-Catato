import { Stack } from "expo-router";
import { AuthProvider } from "../../../utils/context/auth";
import { allStyles } from "../../../components/Styles";

export default function SettingsLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Settings">
                <Stack.Screen
                    name="Settings"
                    options={{
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="About"
                    options={{
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="FAQ"
                    options={{
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="Notifications"
                    options={{
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="AdminPanel"
                    options={{
                        title: "Admin Panel",
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
            </Stack>
        </AuthProvider>
    );
}
