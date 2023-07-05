import { View } from "react-native";
import { ActivityIndicator, Avatar, Text } from "react-native-paper";
import { useNavigation, useRouter } from "expo-router";
import { CatAvatar } from "../../../components/CatAvatar";
import { PillButton } from "../../../components/Button";
import { auth, useAuth } from "../../../utils/context/auth";
import { useState } from "react";
import { signOut } from "firebase/auth";

export default function Update() {
    const { userRole } = useAuth();
    const navigation = useNavigation();
    const router = useRouter();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
        return <ActivityIndicator />;
    }
    if (userRole && !userRole.isUser) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 16,
                    backgroundColor: "white",
                }}
            >
                <Avatar.Image
                    style={{ backgroundColor: "transparent", margin: 16 }}
                    source={require("../../../../assets/catato-logo.png")}
                    size={300}
                />
                <Text
                    variant="bodyLarge"
                    style={{ textAlign: "center", margin: 16 }}
                >
                    If you see a new or injured cat, or just want to help
                    caretakers find where a cat is, sign up or log in to make
                    updates!
                </Text>
                <PillButton label="Signup / Login" onPress={handleLogout} />
            </View>
        );
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
