import { StyleSheet, View } from "react-native";
import { Divider, List }  from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { cats } from "../../../data/CatTempData";
import { CatAvatar } from "../../../components/CatAvatar";

const UpdateOptionList = () => {
    const navigation = useNavigation();

    const route = useRoute();
    const catID = route.params.catID;

    return (
        <List.Section>
            <List.Item  
                title="Update Location"
                titleStyle={styles.title}
                onPress={() => {navigation.navigate("Form", { catID: catID, formType: "location" })}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="Update Concern"
                titleStyle={styles.title}
                onPress={() => {navigation.navigate("Form", { catID: catID, formType: "concern" })}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                bottomDivider
                title="Update Fed Status"
                titleStyle={styles.title}
                onPress={() => {navigation.navigate("Form", { catID: catID, formType: "fed" })}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="Temporarily Foster"
                titleStyle={styles.title}
                onPress={() => {navigation.navigate("Form", { catID: catID, formType: "foster" })}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="Update Profile"
                titleStyle={styles.title}
                onPress={() => {navigation.navigate("Form", { catID: catID, formType: "update" })}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="Remove Cat Profile"
                titleStyle={styles.title}
                onPress={() => {navigation.navigate("Form", { catID: catID, formType: "delete" })}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
        </List.Section>
    );
}

export default function UpdateOptions() {
    const route = useRoute();

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, margin: 16 }}>
                <CatAvatar 
                    photoURL={ route.params.photoURL }
                    size={200}
                    variant="headlineLarge"
                    name={ route.params.name }
                />
            </View>
            <View style={{ flex: 2, margin: 16 }}>
                <UpdateOptionList />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24
    }
})