import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Divider, List, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import { useAuth } from "../../../utils/context/auth";

const UpdateOptionList = ({ cat }) => {
    const { userRole } = useAuth();
    const navigation = useNavigation();

    if (!userRole) {
        return <ActivityIndicator />;
    }
    if (userRole && !userRole.isUser) {
        return <Text>Guest, no updating</Text>;
    }

    return (
        <List.Section>
            {userRole && userRole.isUser && (
                <>
                    <List.Item
                        title="Update Location"
                        titleStyle={styles.title}
                        onPress={() => {
                            navigation.navigate("Form", {
                                ...cat,
                                formType: "location",
                            });
                        }}
                        right={() => <List.Icon icon="arrow-right" />}
                    />
                    <Divider />
                </>
            )}

            {userRole && userRole.isUser && (
                <>
                    <List.Item
                        title="Update Concern"
                        titleStyle={styles.title}
                        onPress={() => {
                            navigation.navigate("Form", {
                                ...cat,
                                formType: "concern",
                            });
                        }}
                        right={() => <List.Icon icon="arrow-right" />}
                    />
                    <Divider />
                </>
            )}

            {userRole && userRole.isCaretaker && (
                <>
                    <List.Item
                        bottomDivider
                        title="Update Fed Status"
                        titleStyle={styles.title}
                        onPress={() => {
                            navigation.navigate("Form", {
                                ...cat,
                                formType: "fed",
                            });
                        }}
                        right={() => <List.Icon icon="arrow-right" />}
                    />
                    <Divider />
                </>
            )}

            {userRole && userRole.isCaretaker && (
                <>
                    <List.Item
                        title="Update Profile"
                        titleStyle={styles.title}
                        onPress={() => {
                            navigation.navigate("Form", {
                                ...cat,
                                formType: "update",
                            });
                        }}
                        right={() => <List.Icon icon="arrow-right" />}
                    />
                    <Divider />
                </>
            )}

            {userRole && userRole.isAdmin && (
                <>
                    <List.Item
                        title="Remove Cat Profile"
                        titleStyle={styles.title}
                        onPress={() => {
                            navigation.navigate("Form", {
                                ...cat,
                                formType: "delete",
                            });
                        }}
                        right={() => <List.Icon icon="arrow-right" />}
                    />
                    <Divider />
                </>
            )}
        </List.Section>
    );
};

export default function UpdateOptions() {
    const route = useRoute();

    return (
        <ScrollView>
            <View style={{ margin: 8 }}>
                <CatAvatar
                    photoURL={route.params.photoURLs[0]}
                    size={200}
                    variant="headlineLarge"
                    name={route.params.name}
                />
            </View>
            <View>
                <UpdateOptionList cat={route.params} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
    },
});
