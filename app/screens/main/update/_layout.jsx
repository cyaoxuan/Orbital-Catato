import { Stack } from "expo-router";
import { AuthProvider } from "../../../utils/context/auth";
import { allStyles } from "../../../components/Styles";

export default function SettingsLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Update">
                <Stack.Screen
                    name="Update"
                    options={{
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="SelectCat"
                    options={{
                        title: "Select Cat",
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="UpdateOptions"
                    options={{
                        title: "Update Options",
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="Form"
                    options={{
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="ConfirmUpdate"
                    options={{
                        title: "Confirm Update",
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                        headerBackVisible: false,
                    }}
                />
            </Stack>
        </AuthProvider>
    );
}
