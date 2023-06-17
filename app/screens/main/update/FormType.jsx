import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";
import { PillButton } from "../../../components/Button";
import { useUserUpdateCatConcern, useUserUpdateCatFed, useUserUpdateCatFoster, useUserUpdateCatLocation } from "../../../utils/db/cat";
import { getImageFromCamera, getImageFromGallery } from "../../../utils/db/photo";

const CreateProfile = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, formType } = props;
    const [processed, setProcessed] = useState(false);

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
    const [processed, setProcessed] = useState(false);
    const { userUpdateCatLocation, loading, error } = useUserUpdateCatLocation();
    const [location, setLocation] = useState("");

    // TODO: put location data under data folder with geohashes, then just get from there
    const locations = [
        { key: "1", value: "Use Current Location" },
        { key: "2", value: "Utown" },
        { key: "3", value: "Engineering" },
        { key: "4", value: "Science" },
        { key: "5", value: "BizCom" },
        { key: "6", value: "Arts" },
    ];

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", { name: name, photoURL: photoURL, formType: formType });
        }
    }, [loading, processed, error, navigation, name, photoURL, formType]);

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
                    data={locations}
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
    const [processed, setProcessed] = useState(false);
    const { userUpdateCatConcern, loading, error } = useUserUpdateCatConcern();
    const [photoURI, setPhotoURI] = useState("");
    const [concernStatus, setConcernStatus] = useState("");
    const [location, setLocation] = useState("");
    const [concernDesc, setConcernDesc] = useState("");
    
    const concerns = [
        { key: "1", value: "Healthy" }
    ];

    // TODO: put location data under data folder with geohashes, then just get from there
    const locations = [
        { key: "1", value: "Use Current Location" },
        { key: "2", value: "Utown" },
        { key: "3", value: "Engineering" },
        { key: "4", value: "Science" },
        { key: "5", value: "BizCom" },
        { key: "6", value: "Arts" },
    ];

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", { name: name, photoURL: photoURL, formType: formType });
        }
    }, [loading, processed, error, navigation, name, photoURL, formType]);

    const handleImageFromGallery = async () => {
        const photoURI = await getImageFromGallery();
        setPhotoURI(photoURI);
    };

    const handleImageFromCamera = async () => {
        const photoURI = await getImageFromCamera();
        setPhotoURI(photoURI);
    };

    const handleUpdate = async () => {
        setProcessed(false);
        // TODO: change to cat and userid
        await userUpdateCatConcern("2nTIJgoSsSTWzspThZlaQJppKuk2", "PMos9bF9blNkKCnGd4c6", concernStatus, location, concernDesc, photoURI);
        setProcessed(true);
    };

    return (
        <View style={styles.formContainer}>
            <Text>Update Concern for {catID}</Text>

            <View style={styles.dropdownContainer}>
                <Text>Concern:</Text>
                <SelectList
                    setSelected={(val) => setConcernStatus(val)}
                    data={concerns}
                    save="value"
                />
            </View>

            <View style={styles.dropdownContainer}>
                <Text>Seen at:</Text>
                <SelectList
                    setSelected={(val) => setLocation(val)}
                    data={locations}
                    save="value"
                />
            </View>

            <PillButton mode="outlined"
                width="60%"
                label="Update"
                onPress={handleUpdate}
                disabled={true}
            />
            {(error[0]) && <Text>Error: {error[0].message}</Text>}
            {(loading[0]) && <ActivityIndicator />}
        </View>
    );
}

const UpdateFed = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, formType } = props;
    const [processed, setProcessed] = useState(false);
    const { userUpdateCatFed, loading, error } = useUserUpdateCatFed();
    const [time, setTime] = useState({});
    const [location, setLocation] = useState("");

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", { name: name, photoURL: photoURL, formType: formType });
        }
    }, [loading, processed, error, navigation, name, photoURL, formType]);

    const handleUpdate = async () => {
        setProcessed(false);
        // TODO: change to cat and userid
        await userUpdateCatFed("2nTIJgoSsSTWzspThZlaQJppKuk2", "PMos9bF9blNkKCnGd4c6", time, location);
        setProcessed(true);
    };

   return (
        <View style={styles.formContainer}>
            <Text>Update Fed for {catID}</Text>
            <PillButton mode="outlined"
                width="60%"
                label="Update"
                onPress={handleUpdate}
                disabled={true}
            />
        </View>
    );
}

const UpdateFoster = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, formType } = props;
    const [processed, setProcessed] = useState(false);
    const { userUpdateCatFoster, loading, error } = useUserUpdateCatFoster();
    const [isFostered, setIsFostered] = useState(false);
    const [fosterReason, setFosterReason] = useState("");

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", { name: name, photoURL: photoURL, formType: formType });
        }
    }, [loading, processed, error, navigation, name, photoURL, formType]);

    const handleUpdate = async () => {
        setProcessed(false);
        // TODO: change to cat and userid
        await userUpdateCatFoster("2nTIJgoSsSTWzspThZlaQJppKuk2", "PMos9bF9blNkKCnGd4c6", isFostered, fosterReason);
        setProcessed(true);
    };

    return (
        <View style={styles.formContainer}>
            <Text>Temporarily Foster {catID} </Text>
            <PillButton mode="outlined"
                width="60%"
                label="Update"
                onPress={handleUpdate}
                disabled={true}
            />
        </View>
    );
}

const UpdateProfile = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, formType } = props;
    const [processed, setProcessed] = useState(false);

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
    const [processed, setProcessed] = useState(false);

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