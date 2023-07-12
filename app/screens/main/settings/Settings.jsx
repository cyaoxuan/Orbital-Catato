import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Divider, List, Text } from "react-native-paper";
import { auth, useAuth } from "../../../utils/context/auth";
import { useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { PillButton } from "../../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { removeUserPushToken } from "../../../utils/db/user";
import { OptionListItemIcon } from "../../../components/OptionListItem";
import { resetCatData } from "../../../data/resetCatData";

// User Details container
// props: user (object), userRole (object)
const UserDetails = ({ user, userRole }) => {
    return (
        <>
            <Text variant={titleVariant}>User Details</Text>
            <Text variant={bodyVariant} style={styles.userDetails}>
                Username:{" "}
                {user
                    ? user.displayName
                        ? user.displayName
                        : "No Username"
                    : "None"}
            </Text>
            <Text variant={bodyVariant} style={styles.userDetails}>
                User ID: {user ? user.uid : "None"}
            </Text>
            <Text variant={bodyVariant} style={styles.userDetails}>
                Email:{" "}
                {user ? (user.isAnonymous ? "No Email" : user.email) : "None"}
            </Text>
            <Text variant={bodyVariant} style={styles.userDetails}>
                User Tier:{" "}
                {userRole
                    ? userRole.isAdmin
                        ? "Admin"
                        : userRole.isCaretaker
                        ? "Caretaker"
                        : userRole.isUser
                        ? "Cat Lover"
                        : "Guest"
                    : "None"}
            </Text>
        </>
    );
};

// Options list for settings
// props: userRole (object)
const SettingsOptionList = ({ userRole }) => {
    const navigation = useNavigation();

    return (
        <List.Section>
            <Divider />
            <OptionListItemIcon
                title="About"
                onPress={() => {}}
                iconName="information-circle-outline"
            />
            <OptionListItemIcon
                title="FAQs"
                onPress={() => {}}
                iconName="help-circle-outline"
            />

            {userRole && userRole.isUser && (
                <OptionListItemIcon
                    title="Notifications"
                    onPress={() => {
                        navigation.navigate("Notifications");
                    }}
                    iconName="notifications-outline"
                />
            )}

            {userRole && userRole.isAdmin && (
                <OptionListItemIcon
                    title="Admin Panel"
                    onPress={() => {
                        navigation.navigate("AdminPanel");
                    }}
                    iconName="build-outline"
                />
            )}

            <OptionListItemIcon
                title="Documentation"
                onPress={() => {}}
                iconName="document-outline"
            />
        </List.Section>
    );
};

export default function Settings() {
    const { user, userRole } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Logs out the user
    const handleLogout = async () => {
        try {
            setLoading(true);
            setError(null);

            const userID = user.uid;
            await signOut(auth); // Firebase auth

            // Get push token from storage
            const token = await AsyncStorage.getItem("expoPushToken");
            if (token) {
                // Got token
                // console.log(token);
                removeUserPushToken(userID, token);
            }

            setLoading(false);
            router.replace("/screens/authentication/Welcome");
        } catch (error) {
            console.error(error);
            setError(error);
            setLoading(false);
        }
    };

    if (!user || !userRole) {
        return <ActivityIndicator />;
    }

    return (
        <ScrollView style={{ margin: 16 }}>
            <View>
                <UserDetails user={user} userRole={userRole} />
            </View>
            <View marginTop={4}>
                <SettingsOptionList userRole={userRole} />
            </View>

            <View style={{ alignItems: "center" }}>
                <PillButton
                    label="Log Out"
                    width="65%"
                    onPress={handleLogout}
                />
                {/* <PillButton label="Reset Data" onPress={resetCatData} /> */}
            </View>

            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
        </ScrollView>
    );
}

const titleVariant = "titleLarge";
const bodyVariant = "bodyMedium";

const styles = StyleSheet.create({
    listTitle: {
        fontSize: 20,
    },
    listView: {
        justifyContent: "center",
        height: 50,
    },
    userDetails: {
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
});
