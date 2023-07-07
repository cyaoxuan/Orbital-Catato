import { ScrollView, StyleSheet, View } from "react-native";
import {
    ActivityIndicator,
    Button,
    DefaultTheme,
    Dialog,
    Divider,
    List,
    Portal,
    Provider,
    Switch,
    Text,
} from "react-native-paper";
import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/context/auth";
import { PillButton } from "../../../components/Button";
import {
    useGetUserByID,
    useUpdateUserNotification,
} from "../../../utils/db/user";
import { useNavigation } from "expo-router";

export default function Notifications() {
    const { user, userRole } = useAuth();
    const navigation = useNavigation();

    // To check if notifications is being updated
    const [processed, setProcessed] = useState(false);
    const [inProgress, setInProgress] = useState(false);

    // Get user
    const { getUserByID, user: userDB, loading, error } = useGetUserByID();
    useEffect(() => {
        const fetchData = async () => {
            setInProgress(true);
            setProcessed(false);
            await getUserByID(user.uid);
            setProcessed(true);
            setInProgress(false);
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Set default selections based on user data
    useEffect(() => {
        if (userDB) {
            setAllNotif(userDB.notiOn);
            setDisableNotif(!userDB.notiOn);
            setNewNotif(userDB.notiType?.new);
            setConcernNotif(userDB.notiType?.concern);
            setFedNotif(userDB.notiType?.fed);
        }
    }, [userDB]);

    // Update notifs
    const {
        updateUserNotification,
        loading: loadingUpdate,
        error: errorUpdate,
    } = useUpdateUserNotification();

    const handleNotifs = async () => {
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);
            await updateUserNotification(
                user.uid,
                allNotif,
                newNotif,
                concernNotif,
                fedNotif
            );

            setProcessed(true);
            setInProgress(false);
            showDialog();
        }
    };

    // For notifications
    const [allNotif, setAllNotif] = useState(false);
    const [newNotif, setNewNotif] = useState(false);
    const [concernNotif, setConcernNotif] = useState(false);
    const [fedNotif, setFedNotif] = useState(false);
    // Disables the other notifications if all notifications is off
    const [disableNotif, setDisableNotif] = useState(true);

    const changeAllNotif = () => {
        setAllNotif((prev) => !prev);
        if (allNotif) {
            setDisableNotif(true);
        } else {
            setDisableNotif(false);
        }
    };

    // Keeps track of if the notification settings changed - if not disable button
    const [changedNotifs, setChangedNotifs] = useState(false);

    useEffect(() => {
        if (!userDB) {
            return;
        }

        if (
            userDB.notiOn !== allNotif ||
            userDB.notiType.new !== newNotif ||
            userDB.notiType.concern !== concernNotif ||
            userDB.notiType.fed !== fedNotif
        ) {
            setChangedNotifs(true);
        } else {
            setChangedNotifs(false);
        }
    }, [userDB, allNotif, newNotif, concernNotif, fedNotif]);

    // Dialog after notifications update
    const [dialogVisible, setDialogVisible] = useState(false);
    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => {
        setDialogVisible(false);
        navigation.navigate("Settings");
    };

    if (!user || !userRole) {
        return <ActivityIndicator />;
    }

    return (
        <Provider theme={lightTheme}>
            <ScrollView style={{ margin: 16 }}>
                <Text variant={titleVariant}>Notifications</Text>
                <List.Section>
                    <List.Item
                        title="Enable Notifications"
                        style={[
                            styles.listView,
                            styles.topListView,
                            styles.bottomListView,
                        ]}
                        titleStyle={styles.listTitle}
                        right={() => (
                            <Switch
                                style={{
                                    transform: [
                                        { scaleX: 1.2 },
                                        { scaleY: 1.2 },
                                    ],
                                }}
                                value={allNotif}
                                onValueChange={changeAllNotif}
                            />
                        )}
                    />
                </List.Section>

                <Text variant={titleVariant}>Types of Notifications</Text>

                <List.Section>
                    <List.Item
                        title="New Cats"
                        description="New cats in the area reported by users"
                        style={[styles.listView, styles.topListView]}
                        titleStyle={styles.listTitle}
                        right={() => (
                            <Switch
                                style={{
                                    transform: [
                                        { scaleX: 1.2 },
                                        { scaleY: 1.2 },
                                    ],
                                }}
                                disabled={disableNotif}
                                value={newNotif}
                                onValueChange={setNewNotif}
                            />
                        )}
                    />
                    <Divider />

                    <List.Item
                        title="Concern"
                        description="Followed cats that are missing or injured"
                        style={[
                            styles.listView,
                            userRole && !userRole.isCaretaker
                                ? styles.bottomListView
                                : "",
                        ]}
                        titleStyle={styles.listTitle}
                        right={() => (
                            <Switch
                                style={{
                                    transform: [
                                        { scaleX: 1.2 },
                                        { scaleY: 1.2 },
                                    ],
                                }}
                                disabled={disableNotif}
                                value={concernNotif}
                                onValueChange={setConcernNotif}
                            />
                        )}
                    />

                    {userRole && userRole.isCaretaker && (
                        <>
                            <Divider />
                            <List.Item
                                title="Unfed"
                                description="Followed cats not fed in 12h"
                                style={[styles.listView, styles.bottomListView]}
                                titleStyle={styles.listTitle}
                                right={() => (
                                    <Switch
                                        style={{
                                            transform: [
                                                { scaleX: 1.2 },
                                                { scaleY: 1.2 },
                                            ],
                                        }}
                                        disabled={disableNotif}
                                        value={fedNotif}
                                        onValueChange={setFedNotif}
                                    />
                                )}
                            />
                        </>
                    )}
                </List.Section>

                <View style={{ alignItems: "center" }}>
                    <PillButton
                        label="Update Settings"
                        disabled={!changedNotifs}
                        onPress={handleNotifs}
                    />
                </View>

                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                        <Dialog.Title>Notifications Update</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">
                                Notifications Update Confirmed! Press done to go
                                back to settings.
                            </Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>Done</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

                {error[0] && <Text>Error: {error[0].message}</Text>}
                {inProgress && <ActivityIndicator />}
            </ScrollView>
        </Provider>
    );
}

const titleVariant = "titleLarge";
const bodyVariant = "bodyMedium";

const lightTheme = {
    ...DefaultTheme,
    mode: "light",
    dark: false,
};

const styles = StyleSheet.create({
    listTitle: {
        fontSize: 20,
    },
    listView: {
        justifyContent: "center",
        height: 70,
        backgroundColor: "white",
    },
    topListView: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    bottomListView: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    userDetails: {
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
});
