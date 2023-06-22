import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Divider, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { PillButton } from "../../../components/Button";
import { DropdownList, FormInput, NumberSpinner, TimeInput, TwoRadioInput, UploadPhotos } from "../../../components/FormComponents";
import {
    useUserCreateCat,
    useUserDeleteCat,
    useUserUpdateCatConcern,
    useUserUpdateCatFed,
    useUserUpdateCatFoster,
    useUserUpdateCatLocation,
    useUserUpdateCatProfile
} from "../../../utils/db/cat";
import { getImageFromCamera, getImageFromGallery } from "../../../utils/db/photo";
import { locations } from "../../../data/locationData";

const today = new Date();

const CreateProfile = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURLs, birthYear, formType } = props;
    const [processed, setProcessed] = useState(false);
    const { userCreateCat, loading, error } = useUserCreateCat();

    // For Name TextInput
    const [newName, setNewName] = useState("");

    // For Image Picker
    const [photoURI, setPhotoURI] = useState("");
    const [photoError, setPhotoError] = useState(null);

    // For Gender Radio
    const [newGender, setNewGender] = useState("F");

    // For BirthYear Spinner
    const [year, setYear] = useState(new Date().getFullYear());

    // For Sterilised Radio
    const [sterile, setSterile] = useState("No");

    // For KeyFeatures TextInput
    const [features, setFeatures] = useState("");

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", { name: newName, photoURLs: [photoURI], formType: formType });
        }
    }, [loading, processed, error, navigation, newName, formType, photoURI]);

    const handleImageFromGallery = async () => {
        try {
            setPhotoError(null);
            const photoURI = await getImageFromGallery();
            setPhotoURI(photoURI);
        } catch (error) {
            console.error(error);
            setPhotoError(error);
        }
    };

    const handleImageFromCamera = async () => {
        try {
            setPhotoError(null);
            const photoURI = await getImageFromCamera();
            setPhotoURI(photoURI);
        } catch (error) {
            console.error(error);
            setPhotoError(error);
        }
    };

    const handleUpdate = async () => {
        setProcessed(false);
        // TODO: change to userid
        await userCreateCat("2nTIJgoSsSTWzspThZlaQJppKuk2", {
            name: newName,
            photoURI: photoURI,
            gender: newGender,
            birthYear: year,
            sterilised: sterile === "Yes",
            keyFeatures: features
        }, false);
        setProcessed(true);
    };

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
                cameraOnPress={handleImageFromCamera}
                galleryOnPress={handleImageFromGallery}
                photoURI={photoURI}
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
                onPress={handleUpdate}
                disabled={name.trim() === "" || features.trim() === "" || photoURI === ""}
            />
            {(error[0]) && <Text>Error: {error[0].message}</Text>}
            {(loading[0]) && <ActivityIndicator />}
        </View>
    );
}

const ReportCat = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURLs, formType } = props;
    const [processed, setProcessed] = useState(false);
    const { userCreateCat, loading, error } = useUserCreateCat();

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
    const [photoURI, setPhotoURI] = useState("");
    const [photoError, setPhotoError] = useState(null);

    // For Concern Radio
    const [concern, setConcern] = useState("Healthy");

    // For ConcernDesc TextInput
    const [concernDescription, setConcernDescription] = useState("");

    // For Sterilised Radio
    const [sterile, setSterile] = useState("No");

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", { name: "New Cat Reported", photoURLs: [photoURI], formType: formType });
        }
    }, [loading, processed, error, navigation, name, photoURI, formType]);

    const handleImageFromGallery = async () => {
        try {
            setPhotoError(null);
            const photoURI = await getImageFromGallery();
            setPhotoURI(photoURI);
        } catch (error) {
            console.error(error);
            setPhotoError(error);
        }
    };

    const handleImageFromCamera = async () => {
        try {
            setPhotoError(null);
            const photoURI = await getImageFromCamera();
            setPhotoURI(photoURI);
        } catch (error) {
            console.error(error);
            setPhotoError(error);
        }
    };

    const handleReport = async () => {
        setProcessed(false);
        // TODO: change to userid
        await userCreateCat("2nTIJgoSsSTWzspThZlaQJppKuk2", {
            lastSeenLocation: location,
            lastSeenTime: date,
            photoURI: photoURI,
            concernDesc: concernDescription,
            sterilised: sterile === "Yes",
        }, true);
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

            <UploadPhotos
                cameraOnPress={handleImageFromCamera}
                galleryOnPress={handleImageFromGallery}
                photoURI={photoURI}
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
                onPress={handleReport}
                disabled={location==="" || concernDescription.trim() === "" || photoURI === "" || date > today}
            />
            {(error[0]) && <Text>Error: {error[0].message}</Text>}
            {(loading[0]) && <ActivityIndicator />}
        </View>
    );
}

const UpdateLocation = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURLs, formType, userID } = props;
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
            navigation.navigate("ConfirmUpdate", { name: name, photoURLs: photoURLs, formType: formType });
        }
    }, [loading, processed, error, navigation, name, photoURLs, formType]);

    const handleUpdate = async () => {
        setProcessed(false);
        // TODO: change to cat and userid
        await userUpdateCatLocation("2nTIJgoSsSTWzspThZlaQJppKuk2", catID, location, date);
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
                disabled={location === "" || date > today}
            />
            {(error[0]) && <Text>Error: {error[0].message}</Text>}
            {(loading[0]) && <ActivityIndicator />}
        </View>
    );
}

const UpdateConcern = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURLs, concernStatus, concernDesc, formType } = props;
    const [processed, setProcessed] = useState(false);
    const { userUpdateCatConcern, loading, error } = useUserUpdateCatConcern();

    // For ImagePicker
    const [photoURI, setPhotoURI] = useState("");
    const [photoError, setPhotoError] = useState(null);

    // For Concern Radio
    const [concern, setConcern] = useState(concernStatus && concernStatus.includes("Injured") ? "Injured" : "Healthy");

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

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", { name: name, photoURLs: photoURLs, formType: formType });
        }
    }, [loading, processed, error, navigation, name, photoURLs, formType]);

    const handleImageFromGallery = async () => {
        try {
            setPhotoError(null);
            const photoURI = await getImageFromGallery();
            setPhotoURI(photoURI);
        } catch (error) {
            console.error(error);
            setPhotoError(error);
        }
    };

    const handleImageFromCamera = async () => {
        try {
            setPhotoError(null);
            const photoURI = await getImageFromCamera();
            setPhotoURI(photoURI);
        } catch (error) {
            console.error(error);
            setPhotoError(error);
        }
    };

    const handleUpdate = async () => {
        setProcessed(false);
        // TODO: change to cat and userid
        await userUpdateCatConcern(
            "2nTIJgoSsSTWzspThZlaQJppKuk2",
            catID,
            location,
            date,
            concern,
            concernDescription,
            photoURI,
            concernStatus
        );
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
                cameraOnPress={handleImageFromCamera}
                galleryOnPress={handleImageFromGallery}
                photoURI={photoURI}
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
                disabled={location === "" || concernDescription.trim() === "" || photoURI === "" || date > today}
            />
            {(error[0]) && <Text>Error: {error[0].message}</Text>}
            {(loading[0]) && <ActivityIndicator />}
        </View>
    );
}

const UpdateFed = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURLs, formType } = props;
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
            navigation.navigate("ConfirmUpdate", { name: name, photoURLs: photoURLs, formType: formType });
        }
    }, [loading, processed, error, navigation, name, photoURLs, formType]);

    const handleUpdate = async () => {
        setProcessed(false);
        // TODO: change to cat and userid
        await userUpdateCatFed("2nTIJgoSsSTWzspThZlaQJppKuk2", catID, date, location);
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
                disabled={location === "" || date > today}
            />
        </View>
    );
}

const UpdateFoster = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURLs, isFostered, fosterReason, formType } = props;
    const [processed, setProcessed] = useState(false);
    const { userUpdateCatFoster, loading, error } = useUserUpdateCatFoster();

    // For Foster Radio
    const [fostered, setFostered] = useState(isFostered ? "Yes" : "No");

    // For FosterReason TextInput
    const [fosterDesc, setFosterDesc] = useState(fosterReason ? fosterReason : "");

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", { name: name, photoURLs: photoURLs[0], formType: formType });
        }
    }, [loading, processed, error, navigation, name, photoURLs, formType]);

    const handleUpdate = async () => {
        setProcessed(false);
        // TODO: change to cat and userid
        await userUpdateCatFoster("2nTIJgoSsSTWzspThZlaQJppKuk2", catID, fostered, fosterDesc);
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
    const { catID, name, photoURLs, gender, birthYear, sterilised, keyFeatures, formType } = props;
    const [processed, setProcessed] = useState(false);
    const { userUpdateCatProfile, loading, error } = useUserUpdateCatProfile();

    // For Name TextInput
    const [newName, setNewName] = useState(name ? name : "");

    // For Image Picker
    const [photoURI, setPhotoURI] = useState("");
    const [photoError, setPhotoError] = useState(null);

    // For Gender Radio
    const [newGender, setNewGender] = useState(gender ? gender : "F");

    // For BirthYear Spinner
    const [year, setYear] = useState(birthYear ? birthYear : new Date().getFullYear());

    // For Sterilised Radio
    const [sterile, setSterile] = useState(sterilised ? "Yes" : "No");

    // For KeyFeatures TextInput
    const [features, setFeatures] = useState(keyFeatures ? keyFeatures : "");

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", { name: name, photoURLs: photoURLs, formType: formType });
        }
    }, [loading, processed, error, navigation, name, photoURLs, formType]);

    const handleImageFromGallery = async () => {
        try {
            setPhotoError(null);
            const photoURI = await getImageFromGallery();
            setPhotoURI(photoURI);
        } catch (error) {
            console.error(error);
            setPhotoError(error);
        }
    };

    const handleImageFromCamera = async () => {
        try {
            setPhotoError(null);
            const photoURI = await getImageFromCamera();
            setPhotoURI(photoURI);
        } catch (error) {
            console.error(error);
            setPhotoError(error);
        }
    };

    const handleUpdate = async () => {
        setProcessed(false);
        // TODO: change to cat and userid
        await userUpdateCatProfile("2nTIJgoSsSTWzspThZlaQJppKuk2", catID, {
            name: newName,
            photoURI: photoURI,
            gender: newGender,
            birthYear: year,
            sterilised: sterile === "Yes",
            keyFeatures: features
        })
        setProcessed(true);
    };

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
                cameraOnPress={handleImageFromCamera}
                galleryOnPress={handleImageFromGallery}
                photoURI={photoURI}
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
                onPress={handleUpdate}
                disabled={name.trim() === "" || features.trim() === "" || photoURI === ""}
            />
            {(error[0]) && <Text>Error: {error[0].message}</Text>}
            {(loading[0]) && <ActivityIndicator />}
        </View>
    );
}

const DeleteProfile = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURLs, formType } = props;
    const [processed, setProcessed] = useState(false);
    const { userDeleteCat, loading, error } = useUserDeleteCat();

    // For Name TextInput
    const [catName, setCatName] = useState("");

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", { name: name, photoURLs: photoURLs, formType: formType });
        }
    }, [loading, processed, error, navigation, name, photoURLs, formType]);

    const handleDelete = async () => {
        setProcessed(false);
        await userDeleteCat("2nTIJgoSsSTWzspThZlaQJppKuk2", catID);
        setProcessed(true);
    }

    return (
        <View style={styles.formContainer}>
            <Text>Deleted Profiles cannot be recovered!</Text>

            <FormInput
                multiline={true}
                label="Cat's Name:"
                placeholder="Name"
                value={catName}
                onChangeText={setCatName}
                errorText="Please enter the cat's name to confirm deletion"
            />
            <PillButton
                label="Delete Profile"
                onPress={handleDelete}
                disabled={catName !== name}
            />
            {(error[0]) && <Text>Error: {error[0].message}</Text>}
            {(loading[0]) && <ActivityIndicator />}
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