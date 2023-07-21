import { ScrollView, View } from "react-native";
import {
    ActivityIndicator,
    Button,
    DefaultTheme,
    Dialog,
    List,
    Portal,
    Provider,
} from "react-native-paper";
import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/context/auth";
import { PillButton } from "../../../components/Button";
import {
    useGetUserByID,
    useUpdateUserNotification,
} from "../../../utils/db/user";
import { useNavigation } from "expo-router";
import {
    allStyles,
    screenMainColor,
    screenSecondaryColor,
    secondaryColor,
} from "../../../components/Styles";
import { SwitchListItem } from "../../../components/OptionListItem";
import { BodyText, ErrorText, TitleText } from "../../../components/Text";

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
        return <ActivityIndicator color={secondaryColor} />;
    }

    return (
        <Provider theme={lightTheme}>
            <View
                style={{
                    backgroundColor: screenSecondaryColor,
                    height: "100%",
                }}
            >
                <ScrollView style={{ margin: 10 }}>
                    <View style={{ paddingHorizontal: 20 }}>
                        <TitleText
                            variant={titleVariant}
                            text="Notifications"
                        />
                    </View>

                    <View style={allStyles.roundedOptionView}>
                        <List.Section style={allStyles.listSection}>
                            <SwitchListItem
                                title="Enable Notifications"
                                value={allNotif}
                                onValueChange={changeAllNotif}
                            />
                        </List.Section>
                    </View>

                    <View style={{ paddingHorizontal: 20 }}>
                        <TitleText
                            variant={titleVariant}
                            text="Types of Notifications"
                        />
                    </View>

                    <View style={allStyles.roundedOptionView}>
                        <List.Section>
                            <SwitchListItem
                                title="New Cats"
                                description="New cats in the area reported by users"
                                disabled={disableNotif}
                                value={newNotif}
                                onValueChange={setNewNotif}
                            />
                            <SwitchListItem
                                title="Concern"
                                description="Followed cats that are missing or injured"
                                disabled={disableNotif}
                                value={concernNotif}
                                onValueChange={setConcernNotif}
                            />

                            {userRole && userRole.isCaretaker && (
                                <SwitchListItem
                                    title="Unfed"
                                    description="Followed cats not fed in 12h"
                                    disabled={disableNotif}
                                    value={fedNotif}
                                    onValueChange={setFedNotif}
                                />
                            )}
                        </List.Section>
                    </View>

                    <View style={{ alignItems: "center" }}>
                        <PillButton
                            label="Update Settings"
                            disabled={!changedNotifs}
                            onPress={handleNotifs}
                        />
                    </View>

                    {error[0] && (
                        <ErrorText text={"Error: " + error[0].message} />
                    )}
                    {inProgress && <ActivityIndicator color={secondaryColor} />}

                    <View style={{ height: 30 }}></View>

                    <Portal>
                        <Dialog
                            visible={dialogVisible}
                            onDismiss={hideDialog}
                            theme={{
                                colors: {
                                    elevation: { level3: screenMainColor },
                                },
                            }}
                        >
                            <Dialog.Title style={allStyles.titleText}>
                                Notifications Update
                            </Dialog.Title>
                            <Dialog.Content>
                                <BodyText
                                    variant="bodyMedium"
                                    text="Notifications Update Confirmed! Press done to go
                                back to settings."
                                />
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button
                                    onPress={hideDialog}
                                    mode="text"
                                    textColor={secondaryColor}
                                    labelStyle={allStyles.buttonText}
                                >
                                    Done
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ScrollView>
            </View>
        </Provider>
    );
}

const titleVariant = "titleMedium";

const lightTheme = {
    ...DefaultTheme,
    mode: "light",
    dark: false,
};
