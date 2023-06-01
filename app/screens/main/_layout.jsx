import { Tabs } from "expo-router";
import { AuthProvider } from "../../context/auth";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MainLayout() {
    return (
        <AuthProvider>
            <Tabs screenOptions={{ tabBarActiveTintColor: "plum" }
            }>
                <Tabs.Screen name="Dashboard" options={{ tabBarLabel: "Dashboard", 
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="grid" size={24} color={ color } />
                    ) 
                }} />
                <Tabs.Screen name="update" options={{ tabBarLabel: "Update", 
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="create" size={24} color={ color } />
                    )
                }} />
                <Tabs.Screen name="catalogue" options={{ tabBarLabel: "CATalogue", 
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="heart" size={24} color={ color } />
                    )
                }} />
                <Tabs.Screen name="Map" options={{ tabBarLabel: "Map", 
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="location" size={24} color={ color } />
                    )
                }} />
                <Tabs.Screen name="settings" options={{ tabBarLabel: "Settings", 
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings" size={24} color={ color } />
                    )
                }} />
            </Tabs>
        </AuthProvider>
    );
}