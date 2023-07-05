import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { CatAvatar } from "../../../components/CatAvatar";
import { PillButton } from "../../../components/Button";
import { useAuth } from "../../../utils/context/auth";

export default function Update() {
    const { userRole } = useAuth();
    const navigation = useNavigation();

    if (!userRole) {
        return <ActivityIndicator />;
    }
    if (userRole && !userRole.isUser) {
        return <Text>Guest, no updating</Text>;
    }

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

            {userRole && userRole.isAdmin && (
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
            )}

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
