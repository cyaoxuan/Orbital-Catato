import { StyleSheet, View } from "react-native";
import {
    ActivityIndicator,
    RadioButton,
    Text,
    TextInput,
} from "react-native-paper";
import { PillButton } from "../../../components/Button";
import { useAuth } from "../../../utils/context/auth";
import { useEffect, useState } from "react";
import { useGetUserByEmail, useUpdateUserRole } from "../../../utils/db/user";

export default function AdminPanel() {
    const { userRole } = useAuth();

    // To check if a user is being searched or updated
    const [processed, setProcessed] = useState(false);
    const [inProgress, setInProgress] = useState(false);

    // For Radiobuttons
    const [radioValue, setRadioValue] = useState("");

    // For TextInput
    const [searchText, setSearchText] = useState("");

    // Get user after search
    const { getUserByEmail, user, loading, error } = useGetUserByEmail();

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
        if (user) {
            user.role.isAdmin
                ? setRadioValue("Admin")
                : user.role.isCaretaker
                ? setRadioValue("Caretaker")
                : setRadioValue("Cat Lover");
        }
    }, [user]);

    // const handleUpdate = async () => {
    //     if (!inProgress) {
    //         setInProgress(true);
    //         setProcessed(false);
    //         await updateUserRole();
    //         setProcessed(true);
    //         setInProgress(false);
    //     } else {
    //         setInProgress(true);
    //     }
    // }

    if (!userRole) {
        return <ActivityIndicator />;
    }

    return (
        <View style={{ alignItems: "center", padding: 16 }}>
            <View style={{ alignItems: "center", padding: 16 }}>
                <Text variant="displaySmall">Update User Roles</Text>
                <Text variant="bodyLarge">
                    Search User by Email to Update Role
                </Text>
            </View>

            <TextInput
                style={{ width: "80%", margin: 16 }}
                mode="outlined"
                label="Email"
                disabled={inProgress}
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
            />

            <PillButton
                label="Search User"
                disabled={inProgress}
                onPress={handleSearch}
            />

            {processed && !user && (
                <Text variant={bodyVariant} style={styles.errorText}>
                    User not found!
                </Text>
            )}
            {processed && user && (
                <>
                    <Text variant={bodyVariant}>
                        User found! UID: {user.userID}
                    </Text>

                    <View style={{ margin: 16 }}>
                        <Text variant="titleMedium">Update User Role:</Text>
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
                                    disabled={inProgress}
                                />
                            </View>
                            <View style={styles.radioButtonContainer}>
                                <Text variant={bodyVariant}>Caretaker</Text>
                                <RadioButton.Android
                                    value="Caretaker"
                                    disabled={inProgress}
                                />
                            </View>
                            <View style={styles.radioButtonContainer}>
                                <Text variant={bodyVariant}>Admin</Text>
                                <RadioButton.Android
                                    value="Admin"
                                    disabled={inProgress}
                                />
                            </View>
                        </RadioButton.Group>
                        <View style={{ alignItems: "center" }}>
                            <PillButton
                                label="Update Role"
                                disabled={inProgress}
                                // onPress={handleUpdate}
                                onPress={() => {}}
                            />
                        </View>
                    </View>
                </>
            )}

            {error[0] && (inProgress || setInProgress(false)) && (
                <Text>Error: {error[0].message}</Text>
            )}
            {inProgress && <ActivityIndicator />}
        </View>
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
