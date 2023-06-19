import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Divider, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { PillButton } from "../../../components/Button";
import { DropdownList, FormInput, NumberSpinner, TimeInput, TwoRadioInput, UploadPhotos } from "../../../components/FormComponents";
import { useUserUpdateCatConcern, useUserUpdateCatFed, useUserUpdateCatFoster, useUserUpdateCatLocation } from "../../../utils/db/cat";
import { getImageFromCamera, getImageFromGallery } from "../../../utils/db/photo";
import { locations } from "../../../data/locationData";

const CreateProfile = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, birthYear, formType } = props;
    const [processed, setProcessed] = useState(false);

    // For Name TextInput
    const [newName, setNewName] = useState("");

    // For Image Picker

    // For Gender Radio
    const [newGender, setNewGender] = useState("F");

    // For BirthYear Spinner
    const [year, setYear] = useState(new Date().getFullYear());

    // For Sterilised Radio
    const [sterile, setSterile] = useState("No");

    // For KeyFeatures TextInput
    const [features, setFeatures] = useState("");

    return (
        <View style={styles.formContainer}>
            <FormInput
                label="Name"
                placeholder="Kitty's Name"
                value={newName}
                onChangeText={setNewName}
                errorText="Please give a cute name for the cat!"
            />

            <Divider />

            <UploadPhotos
                cameraOnPress={() => { }}
                galleryOnPress={() => { }}
            />

            <Divider />

            <TwoRadioInput
                titleText="Gender"
                value={newGender}
                onValueChange={(value) => setNewGender(value)}
                firstText="F"
                firstValue="F"
                secondText="M"
                secondValue="M"
            />

            <Divider />

            <NumberSpinner
                titleText="Birth Year:"
                initValue={birthYear ? birthYear : new Date().getFullYear()}
                min={new Date().getFullYear() - 30}
                max={new Date().getFullYear()}
                value={year}
                onChange={(num) => { setYear(num) }}
            />

            <Divider />

            <TwoRadioInput
                titleText="Sterilised"
                value={sterile}
                onValueChange={(value) => setSterile(value)}
                firstText="Yes"
                firstValue="Yes"
                secondText="No"
                secondValue="No"
            />

            <Divider />

            <FormInput
                multiline={true}
                label="Key Features:"
                placeholder="Breed, tail, habits..."
                value={features}
                onChangeText={setFeatures}
                errorText="Please describe your favourite things about the cat!"
            />
            <PillButton
                label="Create Profile"
                onPress={() => {
                    navigation.navigate("ConfirmUpdate",
                        { name: name, photoURL: photoURL, formType: formType })
                }}
                disabled={name.trim() === "" || features.trim() === ""}
            />
        </View>
    );
}

const ReportCat = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, formType } = props;

    // For Location Dropdown
    const [location, setLocation] = useState("");

    // For RNDateTimePicker
    const [date, setDate] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowTime(false);
        setDate(currentDate);
    }
    
    // For Image Picker

    // For ConcernDesc TextInput
    const [concernDescription, setConcernDescription] = useState("");

    return (
        <View style={styles.formContainer}>
            <DropdownList
                titleText="Seen at:"
                setSelected={(val) => setLocation(val)}
                data={locations}
            />

            <Divider />

            <TimeInput
                titleText="Last Seen Time:"
                displayTime={date}
                value={date}
                onChange={onTimeChange}
                show={showTime}
                onPress={setShowTime}
            />

            <Divider />

            <UploadPhotos
                cameraOnPress={() => { }}
                galleryOnPress={() => { }}
            />

            <Divider />

            <FormInput
                multiline={true}
                label="Description:"
                placeholder="Additional info"
                value={concernDescription}
                onChangeText={setConcernDescription}
                errorText="Please type in anything you think would be helpful!"
            />

            <PillButton
                label="Report"
                onPress={() => {
                    navigation.navigate("ConfirmUpdate",
                        { name: name, photoURL: photoURL, formType: formType })
                }}
                disabled={location==="" || concernDescription.trim() === ""}
            />
        </View>
    );
}

const UpdateLocation = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, formType, userID } = props;
    const [processed, setProcessed] = useState(false);
    const { userUpdateCatLocation, loading, error } = useUserUpdateCatLocation();

    // For Location Dropdown
    const [location, setLocation] = useState("");

    // For RNDateTimePicker
    const [date, setDate] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowTime(false);
        setDate(currentDate);
    }

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
            <DropdownList
                titleText="Seen at:"
                setSelected={(val) => setLocation(val)}
                data={locations}
            />

            <Divider />

            <TimeInput
                titleText="Last Seen Time:"
                displayTime={date}
                value={date}
                onChange={onTimeChange}
                show={showTime}
                onPress={setShowTime}
            />

            <PillButton
                label="Update"
                onPress={handleUpdate}
                disabled={location === ""}
            />
            {(error[0]) && <Text>Error: {error[0].message}</Text>}
            {(loading[0]) && <ActivityIndicator />}
        </View>
    );
}

const UpdateConcern = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, concernStatus, concernDesc, formType } = props;
    const [processed, setProcessed] = useState(false);
    const { userUpdateCatConcern, loading, error } = useUserUpdateCatConcern();

    // For ImagePicker
    const [photoURI, setPhotoURI] = useState("");

    // For Concern Radio
    const [concern, setConcern] = useState(concernStatus && concernStatus.find(x => x === "Injured")
        ? "Injured" : "Healthy");

    // For Location Dropdown
    const [location, setLocation] = useState("");

    // For ConcernDesc TextInput
    const [concernDescription, setConcernDescription] = useState(concernDesc ? concernDesc : "");

    // For RNDateTimePicker
    const [date, setDate] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowTime(false);
        setDate(currentDate);
    }

    // TODO: put location data under data folder with geohashes, then just get from there


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
            <DropdownList
                titleText="Seen at:"
                setSelected={(val) => setLocation(val)}
                data={locations}
            />

            <Divider />

            <TimeInput
                titleText="Last Seen Time:"
                displayTime={date}
                value={date}
                onChange={onTimeChange}
                show={showTime}
                onPress={setShowTime}
            />

            <Divider />

            <TwoRadioInput
                titleText="Concern:"
                value={concern}
                onValueChange={(value) => setConcern(value)}
                firstText="Healthy"
                firstValue="Healthy"
                secondText="Injured"
                secondValue="Injured"
            />

            <Divider />

            <UploadPhotos
                cameraOnPress={() => { }}
                galleryOnPress={() => { }}
            />

            <Divider />

            <FormInput
                multiline={true}
                label="Description:"
                placeholder="Additional concern info"
                value={concernDescription}
                onChangeText={setConcernDescription}
                errorText="Please type in anything you think would be helpful!"
            />

            <PillButton
                label="Update"
                onPress={handleUpdate}
                disabled={location === "" || concernDescription.trim() === ""}
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

    // For Location Dropdown
    const [location, setLocation] = useState("");

    // For RNDateTimePicker
    const [date, setDate] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowTime(false);
        setDate(currentDate);
    }

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", { name: name, photoURL: photoURL, formType: formType });
        }
    }, [loading, processed, error, navigation, name, photoURL, formType]);

    const handleUpdate = async () => {
        setProcessed(false);
        // TODO: change to cat and userid
        await userUpdateCatFed("2nTIJgoSsSTWzspThZlaQJppKuk2", "PMos9bF9blNkKCnGd4c6", date, location);
        setProcessed(true);
    };

    return (
        <View style={styles.formContainer}>
            <DropdownList
                titleText="Seen at:"
                setSelected={(val) => setLocation(val)}
                data={locations}
            />

            <Divider />

            <TimeInput
                titleText="Last Fed Time:"
                displayTime={date}
                value={date}
                onChange={onTimeChange}
                show={showTime}
                onPress={setShowTime}
            />


            <PillButton
                label="Update"
                onPress={handleUpdate}
                disabled={location === ""}
            />
        </View>
    );
}

const UpdateFoster = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, isFostered, fosterReason, formType } = props;
    const [processed, setProcessed] = useState(false);
    const { userUpdateCatFoster, loading, error } = useUserUpdateCatFoster();

    // For Foster Radio
    const [fostered, setFostered] = useState(isFostered ? "Yes" : "No");

    // For FosterReason TextInput
    const [fosterDesc, setFosterDesc] = useState(fosterReason ? fosterReason : "");

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
            <TwoRadioInput
                titleText="Fostering?"
                value={fostered}
                onValueChange={(value) => setFostered(value)}
                firstText="Yes"
                firstValue="Yes"
                secondText="No"
                secondValue="No"
            />

            <Divider />

            <FormInput
                multiline={true}
                label="Reasons:"
                placeholder="Reasons for fostering..."
                value={fosterDesc}
                onChangeText={setFosterDesc}
                errorText="Please give reasons for fostering!"
            />

            <PillButton
                label="Update"
                onPress={handleUpdate}
                disabled={fosterDesc.trim() === ""}
            />
        </View>
    );
}

const UpdateProfile = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURL, gender, birthYear, sterilised, keyFeatures, formType } = props;
    const [processed, setProcessed] = useState(false);

    // For Name TextInput
    const [newName, setNewName] = useState(name ? name : "");

    // For Image Picker

    // For Gender Radio
    const [newGender, setNewGender] = useState(gender ? gender : "F");

    // For BirthYear Spinner
    const [year, setYear] = useState(birthYear ? birthYear : new Date().getFullYear());

    // For Sterilised Radio
    const [sterile, setSterile] = useState(sterilised ? "Yes" : "No");

    // For KeyFeatures TextInput
    const [features, setFeatures] = useState(keyFeatures ? keyFeatures : "");

    return (
        <View style={styles.formContainer}>
            <FormInput
                label="Name"
                placeholder="Kitty's Name"
                value={newName}
                onChangeText={setNewName}
                errorText="Please give a cute name for the cat!"
            />

            <Divider />

            <UploadPhotos
                cameraOnPress={() => { }}
                galleryOnPress={() => { }}
            />

            <Divider />

            <TwoRadioInput
                titleText="Gender"
                value={newGender}
                onValueChange={(value) => setNewGender(value)}
                firstText="F"
                firstValue="F"
                secondText="M"
                secondValue="M"
            />

            <Divider />

            <NumberSpinner
                titleText="Birth Year:"
                initValue={birthYear ? birthYear : new Date().getFullYear()}
                min={new Date().getFullYear() - 30}
                max={new Date().getFullYear()}
                value={year}
                onChange={(num) => { setYear(num) }}
            />

            <Divider />

            <TwoRadioInput
                titleText="Sterilised"
                value={sterile}
                onValueChange={(value) => setSterile(value)}
                firstText="Yes"
                firstValue="Yes"
                secondText="No"
                secondValue="No"
            />

            <Divider />

            <FormInput
                multiline={true}
                label="Key Features:"
                placeholder="Breed, tail, habits..."
                value={features}
                onChangeText={setFeatures}
                errorText="Please describe your favourite things about the cat!"
            />

            <PillButton
                label="Update Profile"
                onPress={() => {
                    navigation.navigate("ConfirmUpdate",
                        { name: name, photoURL: photoURL, formType: formType })
                }}
                disabled={name.trim() === "" || features.trim() === ""}
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
            <Text>Deleted Profiles cannot be recovered!</Text>
            <PillButton
                label="Delete Profile"
                onPress={() => {
                    navigation.navigate("ConfirmUpdate",
                        { name: name, photoURL: photoURL, formType: formType })
                }}
            />
        </View>
    );
}

export {
    CreateProfile, ReportCat, UpdateConcern, UpdateFed,
    UpdateFoster, UpdateLocation, UpdateProfile, DeleteProfile
};

const styles = StyleSheet.create({
    formContainer: {
        alignItems: "center",
        width: "100%"
    },
    dropdownContainer: {
        width: "90%",
        margin: 4,
    },
    radioContainer: {
        width: "90%",
        margin: 4,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
})