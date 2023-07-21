import { ScrollView, View } from "react-native";
import { ActivityIndicator, List, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import { useAuth } from "../../../utils/context/auth";
import { OptionListItem } from "../../../components/OptionListItem";
import {
    allStyles,
    screenSecondaryColor,
    secondaryColor,
} from "../../../components/Styles";

// Render the option lists
const UpdateOptionList = ({ cat }) => {
    const { userRole } = useAuth();
    const navigation = useNavigation();

    if (!userRole) {
        return <ActivityIndicator color={secondaryColor} />;
    }
    if (userRole && !userRole.isUser) {
        // Guests cannot update
        return (
            <Text
                variant="bodyLarge"
                style={{ textAlign: "center", marginHorizontal: 16 }}
            >
                Guests cannot update. If you see a new or injured cat, or just
                want to help caretakers find where a cat is, sign up or log in
                to make updates!
            </Text>
        );
    }

    return (
        // Some options do not show based on user roles
        <View style={allStyles.roundedOptionView}>
            <List.Section style={allStyles.listSection}>
                {userRole && userRole.isUser && (
                    <OptionListItem
                        divider
                        title="Update Location"
                        onPress={() => {
                            navigation.navigate("Form", {
                                ...cat,
                                formType: "location",
                            });
                        }}
                    />
                )}

                {userRole && userRole.isUser && (
                    <OptionListItem
                        divider={userRole && userRole.isCaretaker}
                        title="Update Concern"
                        onPress={() => {
                            navigation.navigate("Form", {
                                ...cat,
                                formType: "concern",
                            });
                        }}
                    />
                )}

                {userRole && userRole.isCaretaker && (
                    <OptionListItem
                        divider
                        title="Update Fed Status"
                        onPress={() => {
                            navigation.navigate("Form", {
                                ...cat,
                                formType: "fed",
                            });
                        }}
                    />
                )}

                {userRole && userRole.isCaretaker && (
                    <OptionListItem
                        divider={userRole && userRole.isAdmin}
                        title="Update Profile"
                        onPress={() => {
                            navigation.navigate("Form", {
                                ...cat,
                                formType: "update",
                            });
                        }}
                    />
                )}

                {userRole && userRole.isAdmin && (
                    <OptionListItem
                        title="Remove Cat Profile"
                        onPress={() => {
                            navigation.navigate("Form", {
                                ...cat,
                                formType: "delete",
                            });
                        }}
                    />
                )}
            </List.Section>
        </View>
    );
};

export default function UpdateOptions() {
    const route = useRoute();

    return (
        <ScrollView style={{ backgroundColor: screenSecondaryColor }}>
            <View style={{ margin: 8 }}>
                <CatAvatar
                    photoURL={route.params.photoURLs[0]}
                    size={200}
                    variant="headlineLarge"
                    name={route.params.name}
                />
            </View>
            <View style={allStyles.roundedOptionView}>
                <UpdateOptionList cat={route.params} />
            </View>
            <View style={{ height: 20 }}></View>
        </ScrollView>
    );
}
