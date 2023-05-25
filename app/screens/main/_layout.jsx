import { Tabs } from "expo-router";
import { AuthProvider } from "../../context/useAuth";

export default function MainLayout() {
    return (
        <AuthProvider>
            <Tabs>
                <Tabs.Screen name="dashboard" options={{ tabBarLabel: "Dashboard" }} />
                <Tabs.Screen name="update" options={{ tabBarLabel: "Update" }} />
                <Tabs.Screen name="catalogue" options={{ tabBarLabel: "CATalogue" }} />
                <Tabs.Screen name="map" options={{ tabBarLabel: "Map" }} />
                <Tabs.Screen name="settings" options={{ tabBarLabel: "Settings" }} />
            </Tabs>
        </AuthProvider>
    );
}
