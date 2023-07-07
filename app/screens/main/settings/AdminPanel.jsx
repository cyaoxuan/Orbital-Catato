import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, RadioButton, Text } from "react-native-paper";
import { PillButton } from "../../../components/Button";
import { useAuth } from "../../../utils/context/auth";
import { useEffect, useState } from "react";
import { useGetUserByEmail, useUpdateUserRole } from "../../../utils/db/user";
import { AuthInput } from "../../../components/TextInput";

export default function AdminPanel() {
    const { user, userRole } = useAuth();

    // To check if a user is being searched or updated
    const [processed, setProcessed] = useState(false);
    const [inProgress, setInProgress] = useState(false);

    // For Radiobuttons
    const [radioValue, setRadioValue] = useState("");

    // For TextInput
    const [searchText, setSearchText] = useState("");

    // Get user after search
    const {
        getUserByEmail,
        user: userDB,
        loading,
        error,
    } = useGetUserByEmail();

    const handleSearch = async () => {
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);
            await getUserByEmail(searchText);
            setProcessed(true);
            setInProgress(false);
        } else {
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

    const handleUpdate = async () => {
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);
            await updateUserRole(userDB.userID, radioValue);
            setProcessed(true);
            setInProgress(false);
        } else {
            setInProgress(true);
        }
    };

    if (!user && !userRole) {
        return <ActivityIndicator />;
    }

    return (
        <ScrollView
            style={{ padding: 16 }}
            contentContainerStyle={{ alignItems: "center" }}
        >
            <View style={{ alignItems: "center", padding: 16 }}>
                <Text variant="displaySmall">Update User Roles</Text>
                <Text variant="bodyLarge">
                    Search User by Email to Update Role
                </Text>
            </View>

            <AuthInput
                label="Email"
                iconName="mail"
                placeholder="orbitee@kitty.xyz"
                textContentType="emailAddress"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
            />

            <PillButton
                label="Search User"
                width="65%"
                disabled={inProgress}
                onPress={handleSearch}
            />

            {processed && !userDB && (
                <Text variant={bodyVariant} style={styles.errorText}>
                    User not found!
                </Text>
            )}
            {processed && userDB && (
                <>
                    <View style={{ alignItems: "center" }}>
                        <Text variant={bodyVariant}>User found!</Text>
                        <Text variant={bodyVariant}>UID: {userDB.userID}</Text>
                    </View>

                    <View style={{ margin: 16 }}>
                        <Text variant="titleMedium">Update User Role:</Text>
                        {userDB.userID === user.uid && (
                            <Text
                                variant={bodyVariant}
                                style={styles.errorText}
                            >
                                You cannot change your own role!
                            </Text>
                        )}
                        <RadioButton.Group
                            value={radioValue}
                            onValueChange={(radioValue) =>
                                setRadioValue(radioValue)
                            }
                        >
                            <View style={styles.radioButtonContainer}>
                                <Text variant={bodyVariant}>Cat Lover</Text>
                                <RadioButton.Android
                                    value="Cat Lover"
                                    disabled={
                                        inProgress || userDB.userID === user.uid
                                    }
                                />
                            </View>
                            <View style={styles.radioButtonContainer}>
                                <Text variant={bodyVariant}>Caretaker</Text>
                                <RadioButton.Android
                                    value="Caretaker"
                                    disabled={
                                        inProgress || userDB.userID === user.uid
                                    }
                                />
                            </View>
                            <View style={styles.radioButtonContainer}>
                                <Text variant={bodyVariant}>Admin</Text>
                                <RadioButton.Android
                                    value="Admin"
                                    disabled={
                                        inProgress || userDB.userID === user.uid
                                    }
                                />
                            </View>
                        </RadioButton.Group>
                        <View style={{ alignItems: "center" }}>
                            <PillButton
                                label="Update Role"
                                disabled={
                                    inProgress || userDB.userID === user.uid
                                }
                                onPress={handleUpdate}
                            />
                        </View>
                    </View>
                </>
            )}

            {error[0] && <Text>Error: {error[0].message}</Text>}
            {errorUpdate[0] && <Text>Error: {errorUpdate[0].message}</Text>}
            {inProgress && <ActivityIndicator />}
        </ScrollView>
    );
}

const bodyVariant = "bodyMedium";

const styles = StyleSheet.create({
    errorText: {
        color: "#BA1A1A",
    },

    container: {
        width: "90%",
        margin: 4,
    },

    radioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 4,
    },

    icon: {
        marginHorizontal: 8,
    },
});
