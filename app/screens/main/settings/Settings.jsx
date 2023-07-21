import { ScrollView, View } from "react-native";
import { ActivityIndicator, Avatar, List, Text } from "react-native-paper";
import { auth, useAuth } from "../../../utils/context/auth";
import { useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { PillButton } from "../../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { removeUserPushToken } from "../../../utils/db/user";
import { OptionListItemIcon } from "../../../components/OptionListItem";
import { BodyText, ErrorText, TitleText } from "../../../components/Text";
import {
    allStyles,
    screenMainColor,
    screenSecondaryColor,
    secondaryColor,
} from "../../../components/Styles";
// import { sendNoti } from "../../../utils/noti";
// import { resetCatData } from "../../../data/resetCatData";

// User Details container
// props: user (object), userRole (object)
const UserDetails = ({ user, userRole }) => {
    return (
        <View style={allStyles.roundedView}>
            <View
                style={{
                    backgroundColor: screenMainColor,
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Avatar.Image
                    source={require("../../../../assets/placeholder.png")}
                    size={80}
                    style={{ marginRight: 16, marginBottom: 10 }}
                />
                <View>
                    <TitleText
                        variant={titleVariant}
                        text={
                            user
                                ? user.displayName
                                    ? user.displayName
                                    : "No Username"
                                : "None"
                        }
                    />
                    <BodyText
                        variant={bodyVariant}
                        text={
                            userRole
                                ? userRole.isAdmin
                                    ? "Admin"
                                    : userRole.isCaretaker
                                    ? "Caretaker"
                                    : userRole.isUser
                                    ? "Cat Lover"
                                    : "Guest"
                                : "None"
                        }
                    />
                </View>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginVertical: 4,
                }}
            >
                <TitleText variant={bodyVariant} text={"UID"} />
                <BodyText
                    variant={subBodyVariant}
                    text={user ? user.uid : "None"}
                />
            </View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    marginVertical: 4,
                }}
            >
                <TitleText variant={bodyVariant} text={"Email"} />
                <BodyText
                    variant={subBodyVariant}
                    text={
                        user
                            ? user.isAnonymous
                                ? "No Email"
                                : user.email
                            : "None"
                    }
                />
            </View>
        </View>
    );
};

// Options list for settings
// props: userRole (object)
const SettingsOptionList = ({ userRole }) => {
    const navigation = useNavigation();

    return (
        <View style={allStyles.roundedOptionView}>
            <List.Section style={allStyles.listSection}>
                <OptionListItemIcon
                    title="About"
                    onPress={() => {
                        navigation.navigate("About");
                    }}
                    iconName="information-circle-outline"
                />
                <OptionListItemIcon
                    title="FAQs"
                    onPress={() => {
                        navigation.navigate("FAQ");
                    }}
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
        </View>
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
        return <ActivityIndicator color={secondaryColor} />;
    }

    return (
        <ScrollView
            style={{ padding: 16, backgroundColor: screenSecondaryColor }}
        >
            <UserDetails user={user} userRole={userRole} />
            <View marginTop={4}>
                <SettingsOptionList userRole={userRole} />
            </View>

            <View style={{ alignItems: "center" }}>
                <PillButton
                    label="Log Out"
                    onPress={handleLogout}
                    disabled={true}
                />
                {/* <PillButton label="Reset Data" onPress={resetCatData} /> */}
            </View>

            {error && <ErrorText text={"Error: " + error.message} />}
            {loading && <ActivityIndicator color={secondaryColor} />}
            <View style={{ height: 20 }}></View>
        </ScrollView>
    );
}

const titleVariant = "titleLarge";
const bodyVariant = "bodyLarge";
const subBodyVariant = "bodyMedium";
