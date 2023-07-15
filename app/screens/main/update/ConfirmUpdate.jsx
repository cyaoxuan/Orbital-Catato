import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import { PillButton } from "../../../components/Button";
import { useAuth } from "../../../utils/context/auth";
import { allStyles, secondaryColor } from "../../../components/Styles";

export default function ConfirmUpdate() {
    const { userRole } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();

    if (!userRole) {
        return <ActivityIndicator color={secondaryColor} />;
    }

    return (
        <View style={allStyles.centerFlexView}>
            <CatAvatar
                photoURL={route.params.photoURLs[0]}
                size={200}
                variant="headlineLarge"
                name={route.params.name}
            />

            <View
                style={{
                    marginHorizontal: 24,
                    paddingVertical: 12,
                }}
            >
                <Text
                    style={[
                        allStyles.bodyText,
                        {
                            textAlign: "center",
                        },
                    ]}
                >
                    Thank you for your contribution!
                </Text>
                {!userRole.isCaretaker &&
                    (route.params.formType === "report" ||
                        route.params.formType === "location" ||
                        route.params.formType === "concern" ||
                        route.params.formType === "fed") && (
                        <Text
                            style={[
                                allStyles.bodyText,
                                {
                                    textAlign: "center",
                                },
                            ]}
                        >
                            {" "}
                            As a non-caretaker user, the precise locations of
                            cats are not shown to you for the safety of the
                            cats. Your update has been recorded and will help
                            caretakers greatly!
                        </Text>
                    )}
            </View>

            {route.params.formType !== "create" &&
                route.params.formType !== "report" &&
                route.params.formType !== "delete" && (
                    <>
                        <PillButton
                            label="Go to Profile"
                            onPress={() => {
                                navigation.navigate("catalogue", {
                                    screen: "CatProfile",
                                    initial: false,
                                    params: { catID: route.params.catID },
                                });
                            }}
                        />

                        <PillButton
                            label={"Continue Updating"}
                            onPress={() => {
                                navigation.navigate("UpdateOptions", {
                                    ...route.params,
                                });
                            }}
                        />
                    </>
                )}
            <PillButton
                label="Update Other Cats"
                onPress={() => {
                    navigation.navigate("Update");
                }}
            />
        </View>
    );
}
