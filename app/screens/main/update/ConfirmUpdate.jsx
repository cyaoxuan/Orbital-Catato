import { View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import { PillButton } from "../../../components/Button";

export default function ConfirmUpdate() {
    const navigation = useNavigation();

    const route = useRoute();

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
                            })
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
