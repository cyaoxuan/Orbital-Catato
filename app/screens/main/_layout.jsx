import { Tabs } from "expo-router";
import { AuthProvider } from "../../utils/context/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { secondaryColor } from "../../components/Styles";

export default function MainLayout() {
    return (
        <AuthProvider>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: secondaryColor,
                    tabBarHideOnKeyboard: true,
                }}
            >
                <Tabs.Screen
                    name="Dashboard"
                    options={{
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                        tabBarLabel: "Dashboard",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? "grid" : "grid-outline"}
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="update"
                    options={{
                        headerShown: false,
                        tabBarLabel: "Update",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? "create" : "create-outline"}
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="catalogue"
                    options={{
                        headerShown: false,
                        tabBarLabel: "CATalogue",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? "heart" : "heart-outline"}
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="Map"
                    options={{
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                        tabBarLabel: "Map",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? "location" : "location-outline"}
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        headerShown: false,
                        tabBarLabel: "Settings",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? "settings" : "settings-outline"}
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </AuthProvider>
    );
}
