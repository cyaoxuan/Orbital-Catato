import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";
import { PillButton } from "../../../components/Button";


const CreateProfile = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, formType } = props;

    return (
        <View style={styles.formContainer}>
            <Text>Create Profile</Text>
            <PillButton mode="outlined"
                width="60%"
                label="Create Profile"
                onPress={() => {navigation.navigate("ConfirmUpdate", 
                { name: name, photoURL: photoURL, formType: formType })}}
                />
        </View>
    );
}

const UpdateLocation = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, formType } = props;
    const [selected, setSelected] = useState("");

    const data = [
        {key: "1", value: "Use Current Location"},
        {key: "2", value: "Utown"},
        {key: "3", value: "Engineering"},
        {key: "4", value: "Science"},
        {key: "5", value: "BizCom"},
        {key: "6", value: "Arts"},
    ]

    return (
        <View style={styles.formContainer}>
            <Text>Update Location for {catID}</Text>
            <View style={styles.dropdownContainer}>
                <SelectList
                    setSelected={(val) => setSelected(val)}
                    data={data}
                    save="value"
                    defaultOption={{ key: "1", value: "Use Current Location" }}
                />
            </View>
            <PillButton mode="outlined"
                width="60%"
                label="Update"
                onPress={() => {navigation.navigate("ConfirmUpdate", 
                { name: name, photoURL: photoURL, formType: formType })}}
                />
        </View>
    );
}

const UpdateConcern = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, formType } = props;

    return (
        <View style={styles.formContainer}>
            <Text>Update Concern for {catID}</Text>
            <PillButton mode="outlined"
                width="60%"
                label="Update"
                onPress={() => {navigation.navigate("ConfirmUpdate", 
                { name: name, photoURL: photoURL, formType: formType })}}
                />
        </View>
    );
}

const UpdateFed = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, formType } = props;

   return (
        <View style={styles.formContainer}>
            <Text>Update Fed for {catID}</Text>
            <PillButton mode="outlined"
                width="60%"
                label="Update"
                onPress={() => {navigation.navigate("ConfirmUpdate", 
                { name: name, photoURL: photoURL, formType: formType })}}
                />
        </View>
    );
}

const UpdateFoster = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, formType } = props;

    return (
        <View style={styles.formContainer}>
            <Text>Temporarily Foster {catID} </Text>
            <PillButton mode="outlined"
                width="60%"
                label="Update"
                onPress={() => {navigation.navigate("ConfirmUpdate", 
                { name: name, photoURL: photoURL, formType: formType })}}
                />
        </View>
    );
}

const UpdateProfile = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, formType } = props;

    return (
        <View style={styles.formContainer}>
            <Text>Update Profile for {catID}</Text>
            <PillButton mode="outlined"
                width="60%"
                label="Update Profile"
                onPress={() => {navigation.navigate("ConfirmUpdate", 
                { name: name, photoURL: photoURL, formType: formType })}}
                />
        </View>
    );
}

const DeleteProfile = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, formType } = props;

    return (
        <View style={styles.formContainer}>
            <Text>Delete Profile for {catID}</Text>
            <PillButton mode="outlined"
                width="60%"
                label="Delete Profile"
                onPress={() => {navigation.navigate("ConfirmUpdate", 
                { name: name, photoURL: photoURL, formType: formType })}}
                />
        </View>
    );
}

export { CreateProfile, UpdateConcern, UpdateFed, 
    UpdateFoster, UpdateLocation, UpdateProfile, DeleteProfile };

const styles = StyleSheet.create({
    formContainer: {
        alignItems: "center",
        width: "100%"
    },
    dropdownContainer: {
        width: "80%"
    }
})