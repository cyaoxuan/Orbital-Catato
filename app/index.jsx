import { AuthProvider } from "./utils/context/auth";
import { useState, useEffect, useRef, useCallback } from "react";
import { Platform } from "react-native";
import { useFonts } from "expo-font";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import WelcomeScreen from "./screens/authentication/Welcome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    // Ensure any route can link back to `/`
    initialRouteName: "index",
};

// Register for push token
async function registerForPushNotificationsAsync() {
    // Set notification channel if android
    if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    // No token if not physical device (emulator)
    let token;
    if (Device.isDevice) {
        // Get device permissions
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            console.log("Failed to get push token for push notification!");
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        console.log("Must use physical device for Push Notifications");
    }

    return token;
}

export default function RootNavigation() {
    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    // Save token to local storage so it can be obtained later
    useEffect(() => {
        const getToken = async () => {
            try {
                const token = await registerForPushNotificationsAsync();
                if (token) {
                    setExpoPushToken(token);
                    await AsyncStorage.setItem("expoPushToken", token);
                }
            } catch (error) {
                console.error(error);
            }
        };

        getToken();

        // Listen for notifications
        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log(response);
                }
            );

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current
            );
            Notifications.removeNotificationSubscription(
                responseListener.current
            );
        };
    }, []);

    // loading font
    const [fontsLoaded] = useFonts({
        "Nunito-ExtraLight": require("../assets/fonts/Nunito-ExtraLight.ttf"),
        "Nunito-Light": require("../assets/fonts/Nunito-Light.ttf"),
        "Nunito-Regular": require("../assets/fonts/Nunito-Regular.ttf"),
        "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
        "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
        "Nunito-ExtraBold": require("../assets/fonts/Nunito-ExtraBold.ttf"),
    });

    // stay in splashscreen until font loads
    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <AuthProvider>
            <WelcomeScreen />
        </AuthProvider>
    );
}
