import { ScrollView, View } from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { PillButton } from "../../../components/Button";
import { AuthInput } from "../../../components/TextInput";
import { ThreeRadioInput } from "../../../components/FormComponents";
import {
    screenSecondaryColor,
    secondaryColor,
} from "../../../components/Styles";
import { BodyText, ErrorText, TitleText } from "../../../components/Text";
import { FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import { dateTimeOptions } from "../../../data/DateTimeOptions";

// Container for Announcements in Admin Panel
// props: flatListRef (ref hook value), inProgress (boolean), announcements (array of announcement objects),
// selectedAnnouncement (hook value), announcementInput (hook value), changeAnnouncementInput (callback), handleAnnouncementUpdate (callback)
// onClearPress (callback), onEditPress (callback), onDeletePress (callback), refreshControl (component)
// errorAnnounce (array), errorCreate (array), errorEdit (array), errorDelete (array), showConfirm (boolean)
const AnnouncementContainer = ({
    flatListRef,
    inProgress,
    announcements,
    selectedAnnouncement,
    announcementInput,
    changeAnnouncementInput,
    handleAnnouncementUpdate,
    onClearPress,
    onEditPress,
    onDeletePress,
    refreshControl,
    errorAnnounce,
    errorCreate,
    errorEdit,
    errorDelete,
    showConfirm,
}) => {
    return (
        <FlatList
            ref={flatListRef}
            refreshControl={refreshControl}
            style={{ paddingBottom: 16, paddingHorizontal: 16 }}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
                <View>
                    <View
                        style={{
                            alignItems: "center",
                            marginBottom: 16,
                        }}
                    >
                        <TitleText
                            variant="displaySmall"
                            text="Announcements"
                        />
                        <BodyText
                            variant="bodyLarge"
                            text="Create, Edit, Delete Announcements"
                        />
                    </View>
                    <View style={{ paddingLeft: 20 }}>
                        <BodyText
                            variant="bodySmall"
                            text={
                                selectedAnnouncement === ""
                                    ? "Creating Announcement"
                                    : "Selected: " + selectedAnnouncement
                            }
                        />
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <TextInput
                            mode="outlined"
                            multiline
                            label="Announcement"
                            selectionColor={secondaryColor}
                            activeOutlineColor={secondaryColor}
                            style={{
                                width: "90%",
                                backgroundColor: screenSecondaryColor,
                                fontSize: 14,
                            }}
                            contentStyle={{
                                height: 120,
                            }}
                            value={announcementInput}
                            onChangeText={changeAnnouncementInput}
                        />
                    </View>
                    <View>
                        {selectedAnnouncement !== "" && (
                            <Button
                                mode="text"
                                textColor={secondaryColor}
                                onPress={onClearPress}
                                disabled={inProgress}
                                labelStyle={{
                                    fontFamily: "Nunito-Medium",
                                    fontSize: 12,
                                }}
                            >
                                Clear Selection
                            </Button>
                        )}
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <PillButton
                            label={selectedAnnouncement ? "Update" : "Create"}
                            disabled={inProgress}
                            onPress={() => {
                                handleAnnouncementUpdate(
                                    selectedAnnouncement === ""
                                        ? null
                                        : selectedAnnouncement
                                );
                            }}
                        />
                        {errorAnnounce[0] && (
                            <ErrorText
                                text={"Error: " + errorAnnounce[0].message}
                            />
                        )}
                        {errorCreate[0] && (
                            <ErrorText
                                text={"Error: " + errorCreate[0].message}
                            />
                        )}
                        {errorEdit[0] && (
                            <ErrorText
                                text={"Error: " + errorEdit[0].message}
                            />
                        )}
                        {errorDelete[0] && (
                            <ErrorText
                                text={"Error: " + errorDelete[0].message}
                            />
                        )}
                        {inProgress && (
                            <ActivityIndicator color={secondaryColor} />
                        )}
                        {showConfirm && (
                            <ErrorText
                                variant="bodyMedium"
                                text="Update Confirmed! Scroll Up to Refresh."
                            />
                        )}
                        {(!announcements || announcements.length === 0) && (
                            <BodyText
                                variant="bodyLarge"
                                text="No Announcements Yet"
                            />
                        )}
                    </View>
                </View>
            }
            data={announcements}
            renderItem={({ item, index }) => {
                return (
                    <View
                        key={item.announcementID}
                        style={styles.announcementView}
                    >
                        <TitleText
                            variant="bodyMedium"
                            text={"Announcement ID: " + item.announcementID}
                        />

                        <BodyText variant="bodyMedium" text={item.message} />
                        <BodyText
                            variant="bodySmall"
                            text={
                                "Updated At: " +
                                item.updatedAt
                                    .toDate()
                                    .toLocaleString("en-GB", dateTimeOptions) +
                                " (SGT)"
                            }
                        />
                        <View
                            style={{
                                flexDirection: "row",
                                paddingVertical: 12,
                            }}
                        >
                            <Button
                                mode="outlined"
                                textColor={secondaryColor}
                                style={[styles.button, { width: "40%" }]}
                                contentStyle={{
                                    height: 36,
                                }}
                                labelStyle={styles.buttonLabel}
                                icon={() => (
                                    <Ionicons
                                        name="create"
                                        size={14}
                                        color={secondaryColor}
                                        style={{ alignSelf: "center" }}
                                    />
                                )}
                                disabled={inProgress}
                                onPress={() => onEditPress(item)}
                            >
                                Edit
                            </Button>
                            <Button
                                mode="outlined"
                                textColor={secondaryColor}
                                style={[styles.button, { width: "50%" }]}
                                contentStyle={{
                                    height: 36,
                                }}
                                labelStyle={styles.buttonLabel}
                                icon={() => (
                                    <Ionicons
                                        name="trash"
                                        size={14}
                                        color={secondaryColor}
                                        style={{ alignSelf: "center" }}
                                    />
                                )}
                                disabled={inProgress}
                                onPress={() =>
                                    onDeletePress(item.announcementID)
                                }
                            >
                                Delete
                            </Button>
                        </View>
                    </View>
                );
            }}
        />
    );
};

// Container for User Roles in Admin Panel
// props: user (object), userDB (object), inProgress (boolean), processed (boolean), error (array), errorUpdate (array),
// searchText (hook value), onChangeSearchText (callback), radioValue (hook value), setRadioValue (callback),
// handleUserSearch (callback), handleRoleUpdate (callback)
const RoleContainer = ({
    user,
    userDB,
    inProgress,
    processed,
    error,
    errorUpdate,
    searchText,
    onChangeSearchText,
    radioValue,
    setRadioValue,
    handleUserSearch,
    handleRoleUpdate,
}) => {
    return (
        <ScrollView
            style={{ padding: 16 }}
            contentContainerStyle={{ alignItems: "center" }}
        >
            <View style={{ alignItems: "center" }}>
                <TitleText variant="displaySmall" text="Update User Roles" />
                <BodyText
                    variant="bodyLarge"
                    text="Search User by Email to Update Role"
                />
            </View>

            <AuthInput
                label="Email"
                disabled={inProgress}
                colorMode="secondary"
                iconName="mail-outline"
                textContentType="emailAddress"
                value={searchText}
                onChangeText={onChangeSearchText}
            />

            <PillButton
                label="Search User"
                disabled={inProgress}
                onPress={handleUserSearch}
            />

            {processed && !userDB && (
                <ErrorText variant={bodyVariant} text="User not found!" />
            )}
            {processed && userDB && (
                <View style={{ width: "100%", alignItems: "center" }}>
                    <View
                        style={{
                            alignItems: "center",
                            marginBottom: 16,
                        }}
                    >
                        <BodyText variant={bodyVariant} text="User found!" />
                        <BodyText
                            variant={bodyVariant}
                            text={"UID: " + userDB.userID}
                        />
                    </View>

                    <TitleText variant="titleMedium" text="Update User Role:" />

                    <View style={{ margin: 16, width: "80%" }}>
                        {userDB.userID === user.uid && (
                            <ErrorText
                                variant={bodyVariant}
                                text="You cannot change your own role!"
                            />
                        )}
                        <ThreeRadioInput
                            disabled={inProgress || userDB.userID === user.uid}
                            value={radioValue}
                            onValueChange={(radioValue) =>
                                setRadioValue(radioValue)
                            }
                            firstValue="Cat Lover"
                            secondValue="Caretaker"
                            thirdValue="Admin"
                        />
                    </View>
                    <PillButton
                        label="Update Role"
                        disabled={inProgress || userDB.userID === user.uid}
                        onPress={handleRoleUpdate}
                    />
                </View>
            )}

            {error[0] && <ErrorText text={"Error: " + error[0].message} />}
            {errorUpdate[0] && (
                <ErrorText text={"Error: " + errorUpdate[0].message} />
            )}
            {inProgress && <ActivityIndicator color={secondaryColor} />}
        </ScrollView>
    );
};

export { AnnouncementContainer, RoleContainer };

const bodyVariant = "bodyMedium";

const styles = StyleSheet.create({
    announcementView: {
        paddingHorizontal: 10,
        paddingTop: 16,
        borderBottomColor: "grey",
        borderBottomWidth: 1,
    },
    button: {
        height: 36,
        marginHorizontal: 2,
        borderColor: secondaryColor,
    },
    buttonLabel: {
        fontFamily: "Nunito-Medium",
        fontSize: 16,
        padding: 0,
        margin: 0,
    },
});
