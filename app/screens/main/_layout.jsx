import { Tabs } from "expo-router";
import { AuthProvider } from "../../context/useAuth";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MainLayout() {
    return (
        <AuthProvider>
            <Tabs screenOptions={{ tabBarActiveTintColor: "plum" }
            }>
                <Tabs.Screen name="Dashboard" options={{ tabBarLabel: "Dashboard", 
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="ios-grid" size={24} color={ color } />
                    ) 
                }} />
                <Tabs.Screen name="Update" options={{ tabBarLabel: "Update", 
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="ios-create" size={24} color={ color } />
                    )
                }} />
                <Tabs.Screen name="Catalogue" options={{ tabBarLabel: "CATalogue", 
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="ios-heart" size={24} color={ color } />
                    )
                }} />
                <Tabs.Screen name="Map" options={{ tabBarLabel: "Map", 
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="ios-location" size={24} color={ color } />
                    )
                }} />
                <Tabs.Screen name="Settings" options={{ tabBarLabel: "Settings", 
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="ios-settings" size={24} color={ color } />
                    )
                }} />
            </Tabs>
        </AuthProvider>
    );
}