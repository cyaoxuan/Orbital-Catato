import { View } from "react-native";
import { ActivityIndicator, Avatar, List, Text } from "react-native-paper";
import { useNavigation, useRouter } from "expo-router";
import { PillButton } from "../../../components/Button";
import { auth, useAuth } from "../../../utils/context/auth";
import { useState } from "react";
import { signOut } from "firebase/auth";
import {
    allStyles,
    screenSecondaryColor,
    secondaryColor,
} from "../../../components/Styles";
import { OptionListItem } from "../../../components/OptionListItem";
import { TitleText } from "../../../components/Text";

export default function Update() {
    const { userRole } = useAuth();
    const navigation = useNavigation();
    const router = useRouter();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // guests can "logout" back to welcome screen
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

    if (!userRole) {
        return <ActivityIndicator color={secondaryColor} />;
    }

    // Guests screen
    if (userRole && !userRole.isUser) {
        return (
            <View style={[allStyles.centerFlexView, { padding: 16 }]}>
                <Avatar.Image
                    style={{ backgroundColor: "transparent", margin: 16 }}
                    source={require("../../../../assets/catato-logo.png")}
                    size={300}
                />
                <Text
                    variant="bodyLarge"
                    style={{
                        fontFamily: "Nunito-Medium",
                        textAlign: "center",
                        margin: 16,
                    }}
                >
                    Guests cannot update. If you see a new or injured cat, or
                    just want to help caretakers find where a cat is, sign up or
                    log in to make updates!
                </Text>
                <PillButton
                    label="Signup / Login"
                    onPress={handleLogout}
                    colorMode="primary"
                />
            </View>
        );
    }

    return (
        <View
            style={{
                padding: 16,
                height: "100%",
                backgroundColor: screenSecondaryColor,
                justifyContent: "center",
            }}
        >
            <View style={{ alignItems: "center" }}>
                <TitleText variant="headlineSmall" text="Update Cats" />
                <Text
                    variant="bodyLarge"
                    style={{
                        fontFamily: "Nunito-Medium",
                        textAlign: "center",
                        margin: 16,
                    }}
                >
                    Please ensure you select the right cat before updating!
                </Text>
            </View>
            <View style={allStyles.roundedOptionView}>
                <List.Section style={allStyles.listSection}>
                    <OptionListItem
                        title="Select Cat"
                        onPress={() => {
                            navigation.navigate("SelectCat");
                        }}
                    />

                    {userRole && userRole.isAdmin && (
                        <OptionListItem
                            title="Create New Profile"
                            onPress={() =>
                                navigation.navigate("Form", {
                                    catID: 0,
                                    name: "New Cat",
                                    photoURLs: null,
                                    formType: "create",
                                })
                            }
                        />
                    )}

                    <OptionListItem
                        title="Report New Cat"
                        onPress={() =>
                            navigation.navigate("Form", {
                                catID: 0,
                                name: "New Cat",
                                photoURLs: null,
                                formType: "report",
                            })
                        }
                    />
                </List.Section>
            </View>
        </View>
    );
}
