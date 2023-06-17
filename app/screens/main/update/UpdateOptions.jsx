import { ScrollView, StyleSheet, View } from "react-native";
import { Divider, List }  from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";

const UpdateOptionList = () => {
    const navigation = useNavigation();

    const route = useRoute();
    const cat = route.params;

    return (
        <List.Section>
            <List.Item  
                title="Update Location"
                titleStyle={styles.title}
                onPress={() => {navigation.navigate("Form", { ...cat, formType: "location" })}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="Update Concern"
                titleStyle={styles.title}
                onPress={() => {navigation.navigate("Form", { ...cat, formType: "concern" })}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                bottomDivider
                title="Update Fed Status"
                titleStyle={styles.title}
                onPress={() => {navigation.navigate("Form", { ...cat, formType: "fed" })}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="Temporarily Foster"
                titleStyle={styles.title}
                onPress={() => {navigation.navigate("Form", { ...cat, formType: "foster" })}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="Update Profile"
                titleStyle={styles.title}
                onPress={() => {navigation.navigate("Form", { ...cat, formType: "update" })}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="Remove Cat Profile"
                titleStyle={styles.title}
                onPress={() => {navigation.navigate("Form", { ...cat, formType: "delete" })}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
        </List.Section>
    );
}

export default function UpdateOptions() {
    const route = useRoute();

    return (
        <ScrollView>
            <View style={{ margin: 8 }}>
                <CatAvatar 
                    photoURL={ route.params.photoURL }
                    size={200}
                    variant="headlineLarge"
                    name={ route.params.name }
                />
            </View>
            <View>
                <UpdateOptionList />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20
    }
})