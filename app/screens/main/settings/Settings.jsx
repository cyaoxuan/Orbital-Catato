import { ScrollView, StyleSheet, View } from "react-native";
import {
    ActivityIndicator,
    Divider,
    List,
    Switch,
    Text,
} from "react-native-paper";
import { auth, useAuth } from "../../../utils/context/auth";
import { useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { PillButton } from "../../../components/Button";
import { Ionicons } from "@expo/vector-icons";

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

const SettingsOptionList = ({ user, userRole }) => {
    const [notifOn, setNotifOn] = useState(false);
    const navigation = useNavigation();

    return (
        <List.Section>
            {userRole && userRole.isUser && (
                <List.Item
                    title="Reset Password"
                    style={styles.listView}
                    titleStyle={styles.listTitle}
                    onPress={() => {}}
                    left={() => (
                        <List.Icon
                            icon={() => (
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={24}
                                />
                            )}
                        />
                    )}
                    right={() => (
                        <List.Icon
                            icon={() => (
                                <Ionicons name="chevron-forward" size={24} />
                            )}
                        />
                    )}
                />
            )}
            <Divider />
            {userRole && userRole.isUser && (
                <List.Item
                    bottomDivider
                    title="Notifications"
                    style={styles.listView}
                    titleStyle={styles.listTitle}
                    left={() => (
                        <List.Icon
                            icon={() => (
                                <Ionicons
                                    name="notifications-outline"
                                    size={24}
                                />
                            )}
                        />
                    )}
                    right={() => (
                        <Switch
                            style={{
                                transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
                            }}
                            value={notifOn}
                            onValueChange={setNotifOn}
                        />
                    )}
                />
            )}
            <Divider />
            <List.Item
                title="About"
                style={styles.listView}
                titleStyle={styles.listTitle}
                onPress={() => {}}
                left={() => (
                    <List.Icon
                        icon={() => (
                            <Ionicons
                                name="information-circle-outline"
                                size={24}
                            />
                        )}
                    />
                )}
                right={() => (
                    <List.Icon
                        icon={() => (
                            <Ionicons name="chevron-forward" size={24} />
                        )}
                    />
                )}
            />
            <Divider />
            <List.Item
                title="FAQs"
                style={styles.listView}
                titleStyle={styles.listTitle}
                onPress={() => {}}
                left={() => (
                    <List.Icon
                        icon={() => (
                            <Ionicons name="help-circle-outline" size={24} />
                        )}
                    />
                )}
                right={() => (
                    <List.Icon
                        icon={() => (
                            <Ionicons name="chevron-forward" size={24} />
                        )}
                    />
                )}
            />
            <Divider />
            <List.Item
                title="Documentation"
                style={styles.listView}
                titleStyle={styles.listTitle}
                onPress={() => {}}
                left={() => (
                    <List.Icon
                        icon={() => (
                            <Ionicons name="document-outline" size={24} />
                        )}
                    />
                )}
                right={() => (
                    <List.Icon
                        icon={() => (
                            <Ionicons name="chevron-forward" size={24} />
                        )}
                    />
                )}
            />
            <Divider />
            {userRole && userRole.isAdmin && (
                <List.Item
                    title="Admin Panel"
                    style={styles.listView}
                    titleStyle={styles.listTitle}
                    onPress={() => {}}
                    left={() => (
                        <List.Icon
                            icon={() => (
                                <Ionicons name="build-outline" size={24} />
                            )}
                        />
                    )}
                    right={() => (
                        <List.Icon
                            icon={() => (
                                <Ionicons name="chevron-forward" size={24} />
                            )}
                        />
                    )}
                />
            )}
            <Divider />
            {userRole && !userRole.isCaretaker && (
                <List.Item
                    title="Request Caretaker Tier"
                    style={styles.listView}
                    titleStyle={styles.listTitle}
                    onPress={() => {}}
                    left={() => (
                        <List.Icon
                            icon={() => (
                                <Ionicons name="create-outline" size={24} />
                            )}
                        />
                    )}
                    right={() => (
                        <List.Icon
                            icon={() => (
                                <Ionicons name="chevron-forward" size={24} />
                            )}
                        />
                    )}
                />
            )}
            <Divider />
        </List.Section>
    );
};

export default function Settings() {
    const { user, userRole } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        setLoading(true);
        signOut(auth)
            .then(() => {
                setLoading(false);
                router.replace("/screens/authentication/Welcome");
            })
            .catch((error) => {
                console.error(error);
                setError(error);
                setLoading(false);
            });
    };

    if (!user || !userRole) {
        return <ActivityIndicator />;
    }

    return (
        <ScrollView style={{ margin: 16 }}>
            <View>
                <UserDetails user={user} userRole={userRole} />
            </View>
            <Divider />
            <View marginTop={4}>
                <SettingsOptionList user={user} userRole={userRole} />
            </View>

            <View style={{ alignItems: "center" }}>
                <PillButton label="Log Out" onPress={handleLogout} />
            </View>

            {error && <Text>{error.message}</Text>}
            {loading && <ActivityIndicator />}
        </ScrollView>
    );
}

const titleVariant = "titleLarge";
const bodyVariant = "bodyLarge";

const styles = StyleSheet.create({
    listTitle: {
        fontSize: 24,
    },
    listView: {
        justifyContent: "center",
        height: 65,
    },
    userDetails: {
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
});
