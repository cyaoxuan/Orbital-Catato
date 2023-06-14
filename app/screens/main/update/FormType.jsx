import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";
import { PillButton } from "../../../components/Button";
import { useUserUpdateCatLocation } from "../../../utils/db/cat";


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
    const { catID, name, photoURL, formType, userID } = props;
    const { userUpdateCatLocation, loading, error } = useUserUpdateCatLocation();
    const [location, setLocation] = useState("");
    const [processed, setProcessed] = useState(false);

    // TODO: put location data under data folder with geohashes, then just get from there
    const data = [
        { key: "1", value: "Use Current Location" },
        { key: "2", value: "Utown" },
        { key: "3", value: "Engineering" },
        { key: "4", value: "Science" },
        { key: "5", value: "BizCom" },
        { key: "6", value: "Arts" },
    ];

    useEffect(() => {
        if (processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", { name: name, photoURL: photoURL, formType: formType });
        }
    }, [processed, error, navigation, name, photoURL, formType]);

    const handleUpdate = async () => {
        setProcessed(false);
        // TODO: change to cat and userid
        await userUpdateCatLocation("2nTIJgoSsSTWzspThZlaQJppKuk2", "PMos9bF9blNkKCnGd4c6", location); 
        setProcessed(true);
    };

    return (
        <View style={styles.formContainer}>
            <Text>Update Location for {catID}</Text>
            <View style={styles.dropdownContainer}>
                <SelectList
                    setSelected={(val) => setLocation(val)}
                    data={data}
                    save="value"
                />
            </View>
            
            <PillButton 
                label="Update"
                onPress={handleUpdate}
                disabled={location===""}
            />
            {(error[0]) && <Text>Error: {error[0].message}</Text>}
            {(loading[0]) && <ActivityIndicator />}
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