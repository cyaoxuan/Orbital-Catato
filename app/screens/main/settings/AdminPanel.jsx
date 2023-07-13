import { RefreshControl, View } from "react-native";
import {
    ActivityIndicator,
    Button,
    DefaultTheme,
    Dialog,
    Portal,
    Provider,
} from "react-native-paper";
import { FilterButton } from "../../../components/Button";
import { useAuth } from "../../../utils/context/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetUserByEmail, useUpdateUserRole } from "../../../utils/db/user";
import {
    allStyles,
    screenMainColor,
    secondaryColor,
} from "../../../components/Styles";
import { AnnouncementContainer, RoleContainer } from "./AdminContainers";
import {
    useCreateAnnouncement,
    useDeleteAnnouncement,
    useGetAnnouncements,
    useUpdateAnnouncement,
} from "../../../utils/db/announcement";
import { BodyText } from "../../../components/Text";

export default function AdminPanel() {
    const { user, userRole } = useAuth();

    // For refresh and showing update time
    const [refreshing, setRefreshing] = useState(false);

    // Refresh control callback
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    // For filter buttons (announcements/roles)
    const [filterValue, setFilterValue] = useState("Announcements");

    // To check if any DB calls are being made
    const [processed, setProcessed] = useState(false);
    const [inProgress, setInProgress] = useState(false);

    // Announcements
    // Tell users update is confirmed and to refresh
    const [showConfirm, setShowConfirm] = useState(false);

    // Text Input
    const [announcementInput, setAnnouncementInput] = useState("");
    const changeAnnouncementInput = (value) => {
        setAnnouncementInput(value);
    };
    const onClearPress = () => {
        setSelectedAnnouncement("");
        setAnnouncementInput("");
    };
    const [selectedAnnouncement, setSelectedAnnouncement] = useState("");

    // Scroll flatlist to top and set selected announcement
    const flatListRef = useRef();

    const onEditPress = (announcement) => {
        flatListRef.current?.scrollToOffset({
            offset: 0,
            animated: true,
        });
        setSelectedAnnouncement(announcement.announcementID);
        setAnnouncementInput(announcement.message);
    };

    // DB Utils to fetch announcements
    const {
        announcements,
        getAnnouncements,
        loading: loadingAnnounce,
        error: errorAnnounce,
    } = useGetAnnouncements();

    useEffect(() => {
        const fetchData = async () => {
            setInProgress(true);
            await getAnnouncements();
            setInProgress(false);
            setShowConfirm(false);
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshing]);

    // Create / Update announcement
    const {
        createAnnouncement,
        loading: loadingCreate,
        error: errorCreate,
    } = useCreateAnnouncement();

    const {
        updateAnnouncement,
        loading: loadingEdit,
        error: errorEdit,
    } = useUpdateAnnouncement();

    const handleAnnouncementUpdate = async (announcementID) => {
        if (!inProgress) {
            setInProgress(true);
            if (announcementID) {
                await updateAnnouncement(announcementID, announcementInput);
            } else {
                await createAnnouncement(announcementInput);
            }
            setInProgress(false);
            setAnnouncementInput("");
            setSelectedAnnouncement("");
            setShowConfirm(true);
        }
    };

    // Delete announcement
    const [deletingAnnouncement, setDeletingAnnouncement] = useState("");

    const {
        deleteAnnouncement,
        loading: loadingDelete,
        error: errorDelete,
    } = useDeleteAnnouncement();

    const handleAnnouncementDelete = async () => {
        if (!inProgress) {
            setInProgress(true);
            await deleteAnnouncement(deletingAnnouncement);
            setInProgress(false);
            setShowConfirm(true);
            hideDialog();
        }
    };

    const onDeletePress = (announcementID) => {
        setDeletingAnnouncement(announcementID);
        showDialog();
    };

    // Dialog for Deleting
    const [dialogVisible, setDialogVisible] = useState(false);
    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => {
        setDialogVisible(false);
        setDeletingAnnouncement("");
    };

    // User roles
    // For Radiobuttons
    const [radioValue, setRadioValue] = useState("");

    // For TextInput
    const [searchText, setSearchText] = useState("");
    const onChangeSearchText = (value) => {
        setSearchText(value);
    };

    // Get user after search
    const {
        getUserByEmail,
        user: userDB,
        loading: loadingUser,
        error: errorUser,
    } = useGetUserByEmail();

    const handleUserSearch = async () => {
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);
            await getUserByEmail(searchText);
            setProcessed(true);
            setInProgress(false);
        }
    };

    useEffect(() => {
        if (userDB) {
            userDB.role.isAdmin
                ? setRadioValue("Admin")
                : userDB.role.isCaretaker
                ? setRadioValue("Caretaker")
                : setRadioValue("Cat Lover");
        }
    }, [userDB]);

    // Update userDB roles
    const {
        updateUserRole,
        loading: loadingUpdate,
        error: errorUpdate,
    } = useUpdateUserRole();

    const handleRoleUpdate = async () => {
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);
            await updateUserRole(userDB.userID, radioValue);
            setProcessed(true);
            setInProgress(false);
        }
    };

    if (!user && !userRole) {
        return <ActivityIndicator color={secondaryColor} />;
    }

    return (
        <Provider theme={lightTheme}>
            <View style={{ backgroundColor: screenMainColor, height: "100%" }}>
                <View style={{ width: "100%", alignItems: "center" }}>
                    <FilterButton
                        filterValue={filterValue}
                        onValueChange={(value) => setFilterValue(value)}
                        disabled={inProgress}
                        firstValue="Announcements"
                        secondValue="User Roles"
                    />
                </View>

                {filterValue === "Announcements" ? (
                    <AnnouncementContainer
                        flatListRef={flatListRef}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        inProgress={inProgress}
                        processed={processed}
                        announcements={announcements}
                        selectedAnnouncement={selectedAnnouncement}
                        announcementInput={announcementInput}
                        changeAnnouncementInput={changeAnnouncementInput}
                        handleAnnouncementUpdate={handleAnnouncementUpdate}
                        onClearPress={onClearPress}
                        onEditPress={onEditPress}
                        onDeletePress={onDeletePress}
                        errorAnnounce={errorAnnounce}
                        errorCreate={errorCreate}
                        errorEdit={errorEdit}
                        errorDelete={errorDelete}
                        showConfirm={showConfirm}
                    />
                ) : (
                    <RoleContainer
                        user={user}
                        userDB={userDB}
                        inProgress={inProgress}
                        processed={processed}
                        error={errorUser}
                        errorUpdate={errorUpdate}
                        searchText={searchText}
                        onChangeSearchText={onChangeSearchText}
                        radioValue={radioValue}
                        setRadioValue={setRadioValue}
                        handleUserSearch={handleUserSearch}
                        handleRoleUpdate={handleRoleUpdate}
                    />
                )}

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
                        <Dialog.Title style={{ fontFamily: "Nunito-Bold" }}>
                            Delete Announcement
                        </Dialog.Title>
                        <Dialog.Content>
                            <BodyText
                                variant="bodyMedium"
                                text="Are you sure you want to delete this announcement?"
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                onPress={hideDialog}
                                mode="text"
                                textColor={secondaryColor}
                                labelStyle={allStyles.buttonText}
                            >
                                Cancel
                            </Button>
                            <Button
                                onPress={() =>
                                    handleAnnouncementDelete(
                                        selectedAnnouncement
                                    )
                                }
                                mode="text"
                                textColor={secondaryColor}
                                labelStyle={allStyles.buttonText}
                            >
                                Confirm Delete
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </Provider>
    );
}

const lightTheme = {
    ...DefaultTheme,
    mode: "light",
    dark: false,
};
