import { Tabs } from "expo-router";
import { AuthProvider } from "../../context/auth";

export default function MainLayout() {
    return (
        <AuthProvider>
            <Tabs>
                <Tabs.Screen name="Dashboard" options={{ tabBarLabel: "Dashboard" }} />
                <Tabs.Screen name="Update" options={{ tabBarLabel: "Update" }} />
                <Tabs.Screen name="CATalogue" options={{ tabBarLabel: "CATalogue" }} />
                <Tabs.Screen name="Map" options={{ tabBarLabel: "Map" }} />
                <Tabs.Screen name="Settings" options={{ tabBarLabel: "Settings" }} />
            </Tabs>
        </AuthProvider>
    );
}