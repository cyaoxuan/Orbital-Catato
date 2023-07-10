import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import { PillButton } from "../../../components/Button";
import { useAuth } from "../../../utils/context/auth";

export default function ConfirmUpdate() {
    const { userRole } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();

    if (!userRole) {
        return <ActivityIndicator />;
    }

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <CatAvatar
                photoURL={route.params.photoURLs[0]}
                size={200}
                variant="headlineLarge"
                name={route.params.name}
            />

            <Text
                style={{
                    marginHorizontal: 100,
                    paddingVertical: 20,
                    textAlign: "center",
                }}
            >
                Thank you for your contribution!
                {!userRole.isCaretaker &&
                    (route.params.formType === "report" ||
                        route.params.formType === "location" ||
                        route.params.formType === "concern" ||
                        route.params.formType === "fed") && (
                        <Text
                            style={{
                                marginHorizontal: 100,
                                paddingVertical: 20,
                                textAlign: "center",
                            }}
                        >
                            As a non-caretaker user, the precise locations of
                            cats are not shown to you for the safety of the
                            cats. Your update has been recorded and will help
                            caretakers greatly!
                        </Text>
                    )}
            </Text>

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
