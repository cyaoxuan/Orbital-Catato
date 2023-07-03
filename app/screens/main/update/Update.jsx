import { View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import { PillButton } from "../../../components/Button";

export default function Update() {
    const navigation = useNavigation();

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <CatAvatar
                photoURL={null}
                size={200}
                variant="headlineLarge"
                name="Select Cat"
            />
            <PillButton
                label="Select Cat"
                onPress={() => {
                    navigation.navigate("SelectCat");
                }}
            />
            <Text
                style={{
                    marginHorizontal: 100,
                    paddingVertical: 20,
                    textAlign: "center",
                }}
            >
                Please ensure you have selected the right cat before proceeding
            </Text>

            <PillButton
                label="Create New Profile"
                onPress={() =>
                    navigation.navigate("Form", {
                        catID: 0,
                        name: "New Cat",
                        photoURLs: null,
                        formType: "create",
                    })
                }
            />

            <PillButton
                label="Report New Cat"
                onPress={() =>
                    navigation.navigate("Form", {
                        catID: 0,
                        name: "New Cat",
                        photoURLs: null,
                        formType: "report",
                    })
                }
            />
        </View>
    );
}
