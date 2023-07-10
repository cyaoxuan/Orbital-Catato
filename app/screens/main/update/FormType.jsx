import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Divider, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { PillButton } from "../../../components/Button";
import {
    DropdownList,
    FormInput,
    NumberSpinner,
    TimeInput,
    TwoRadioInput,
    UploadPhotos,
} from "../../../components/FormComponents";
import {
    useUserCreateCat,
    useUserDeleteCat,
    useUserUpdateCatConcern,
    useUserUpdateCatFed,
    useUserUpdateCatLocation,
    useUserUpdateCatProfile,
} from "../../../utils/db/cat";
import {
    getImageFromCamera,
    getImageFromGallery,
} from "../../../utils/db/photo";
import { locations } from "../../../data/locationData";

const CreateProfile = (props) => {
    const navigation = useNavigation();
    const { name, birthYear, formType } = props;
    const [processed, setProcessed] = useState(false);
    const [inProgress, setInProgress] = useState(false);
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
            navigation.navigate("ConfirmUpdate", {
                name: newName,
                photoURLs: [photoURI],
                formType: formType,
            });
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
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);
            // TODO: change to userid
            await userCreateCat(
                props.userID,
                {
                    name: newName,
                    photoURI: photoURI,
                    gender: newGender,
                    birthYear: year,
                    sterilised: sterile === "Yes",
                    keyFeatures: features,
                },
                false
            );
            setProcessed(true);
            setInProgress(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text variant={titleVariant}>Create Profile</Text>
            <FormInput
                label="Name"
                placeholder="Kitty's Name"
                value={newName}
                onChangeText={setNewName}
                errorText="Please give a cute name for the cat!"
            />

            <Divider />

            <UploadPhotos
                titleText="Upload photo:"
                cameraOnPress={handleImageFromCamera}
                galleryOnPress={handleImageFromGallery}
                photoURI={photoURI}
                showError={true}
            />

            <Divider />

            <TwoRadioInput
                titleText="Gender"
                value={newGender}
                onValueChange={(value) => setNewGender(value)}
                firstValue="F"
                secondValue="M"
            />

            <Divider />

            <NumberSpinner
                titleText="Birth Year:"
                initValue={birthYear ? birthYear : new Date().getFullYear()}
                min={new Date().getFullYear() - 30}
                max={new Date().getFullYear()}
                value={year}
                onChange={(num) => {
                    setYear(num);
                }}
            />

            <Divider />

            <TwoRadioInput
                titleText="Sterilised"
                value={sterile}
                onValueChange={(value) => setSterile(value)}
                firstValue="Yes"
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
                disabled={
                    name.trim() === "" ||
                    features.trim() === "" ||
                    photoURI === "" ||
                    inProgress
                }
            />
            {error[0] && <Text>Error: {error[0].message}</Text>}
            {loading[0] && <ActivityIndicator />}
        </View>
    );
};

const ReportCat = (props) => {
    const navigation = useNavigation();
    const { name, formType } = props;
    const [processed, setProcessed] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const { userCreateCat, loading, error } = useUserCreateCat();

    // For Location Dropdown
    const [location, setLocation] = useState("");

    // For RNDateTimePicker
    // Get current time so it can be used to check against selected time
    const todayRef = useRef(new Date());
    const today = todayRef.current;
    const [date, setDate] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowTime(false);
        setDate(currentDate);
    };
    // To keep updating current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            todayRef.current = new Date();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
            navigation.navigate("ConfirmUpdate", {
                name: "New Cat Reported",
                photoURLs: [photoURI],
                formType: formType,
            });
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
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);
            // TODO: change to userid
            await userCreateCat(
                props.userID,
                {
                    lastSeenLocation: location,
                    lastSeenTime: date,
                    photoURI: photoURI,
                    concernStatus: concern,
                    concernDesc: concernDescription,
                    sterilised: sterile === "Yes",
                },
                true
            );
            setProcessed(true);
            setInProgress(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text variant={titleVariant}>Report Cat</Text>
            <DropdownList
                titleText="Seen at:"
                selected={location}
                setSelected={(val) => setLocation(val)}
                data={locations}
            />

            <Divider />

            <TimeInput
                titleText="Last Seen Time:"
                today={today}
                displayTime={date}
                value={date}
                onChange={onTimeChange}
                show={showTime}
                onPress={setShowTime}
            />

            <Divider />

            <UploadPhotos
                titleText="Upload photo:"
                cameraOnPress={handleImageFromCamera}
                galleryOnPress={handleImageFromGallery}
                photoURI={photoURI}
                showError={true}
            />

            <Divider />

            <TwoRadioInput
                titleText="Sterilised"
                value={sterile}
                onValueChange={(value) => setSterile(value)}
                firstValue="Yes"
                secondValue="No"
            />

            <Divider />

            <TwoRadioInput
                titleText="Concern:"
                value={concern}
                onValueChange={(value) => setConcern(value)}
                firstValue="Healthy"
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
                disabled={
                    location === "" ||
                    concernDescription.trim() === "" ||
                    photoURI === "" ||
                    date > today ||
                    inProgress
                }
            />
            {error[0] && <Text>Error: {error[0].message}</Text>}
            {loading[0] && <ActivityIndicator />}
        </View>
    );
};

const UpdateLocation = (props) => {
    const navigation = useNavigation();
    const {
        catID,
        name,
        photoURLs,
        gender,
        birthYear,
        sterilised,
        keyFeatures,
        concernStatus,
        concernDesc,
        formType,
        userID,
    } = props;
    const [processed, setProcessed] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const { userUpdateCatLocation, loading, error } =
        useUserUpdateCatLocation();

    // For Location Dropdown
    const [location, setLocation] = useState("");

    // For RNDateTimePicker
    // Get current time so it can be used to check against selected time
    const todayRef = useRef(new Date());
    const today = todayRef.current;
    const [date, setDate] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowTime(false);
        setDate(currentDate);
    };
    // To keep updating current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            todayRef.current = new Date();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", {
                catID: catID,
                name: name,
                gender: gender,
                birthYear: birthYear,
                sterilised: sterilised,
                keyFeatures: keyFeatures,
                photoURLs: photoURLs,
                concernStatus: concernStatus,
                concernDesc: concernDesc,
                formType: formType,
            });
        }
    }, [
        loading,
        processed,
        error,
        navigation,
        catID,
        name,
        gender,
        birthYear,
        sterilised,
        keyFeatures,
        photoURLs,
        formType,
        concernStatus,
        concernDesc,
    ]);

    const handleUpdate = async () => {
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);

            await userUpdateCatLocation(props.userID, catID, location, date);
            setProcessed(true);
            setInProgress(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text variant={titleVariant}>Update Location</Text>
            <DropdownList
                titleText="Seen at:"
                selected={location}
                setSelected={(val) => setLocation(val)}
                data={locations}
            />

            <Divider />

            <TimeInput
                titleText="Last Seen Time:"
                today={today}
                displayTime={date}
                value={date}
                onChange={onTimeChange}
                show={showTime}
                onPress={setShowTime}
            />

            <PillButton
                label="Update"
                onPress={handleUpdate}
                disabled={location === "" || date > today || inProgress}
            />
            {error[0] && <Text>Error: {error[0].message}</Text>}
            {loading[0] && <ActivityIndicator />}
        </View>
    );
};

const UpdateConcern = (props) => {
    const navigation = useNavigation();
    const {
        catID,
        name,
        photoURLs,
        gender,
        birthYear,
        sterilised,
        keyFeatures,
        concernStatus,
        concernDesc,
        formType,
        userID,
    } = props;
    const [processed, setProcessed] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const { userUpdateCatConcern, loading, error } = useUserUpdateCatConcern();

    // For ImagePicker
    const [photoURI, setPhotoURI] = useState("");
    const [photoError, setPhotoError] = useState(null);

    // For Concern Radio
    const [concern, setConcern] = useState(
        concernStatus.injured ? "Injured" : "Healthy"
    );

    // For Location Dropdown
    const [location, setLocation] = useState("");

    // For ConcernDesc TextInput
    const [concernDescription, setConcernDescription] = useState(
        concernDesc ? concernDesc : ""
    );

    // For RNDateTimePicker
    // Get current time so it can be used to check against selected time
    const todayRef = useRef(new Date());
    const today = todayRef.current;
    const [date, setDate] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowTime(false);
        setDate(currentDate);
    };
    // To keep updating current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            todayRef.current = new Date();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            // Process new concern status to pass around
            navigation.navigate("ConfirmUpdate", {
                catID: catID,
                name: name,
                gender: gender,
                birthYear: birthYear,
                sterilised: sterilised,
                keyFeatures: keyFeatures,
                photoURLs: photoURLs,
                concernStatus: {
                    injured: concern === "Injured",
                    missing: concernStatus.missing,
                    new: concernStatus.new,
                    unfed: concernStatus.unfed,
                },
                concernDesc: concernDescription,
                formType: formType,
            });
        }
    }, [
        loading,
        processed,
        error,
        navigation,
        catID,
        name,
        gender,
        birthYear,
        sterilised,
        keyFeatures,
        photoURLs,
        concern,
        concernDescription,
        formType,
        concernStatus,
    ]);

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
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);

            await userUpdateCatConcern(
                props.userID,
                catID,
                location,
                date,
                concern,
                concernDescription,
                photoURI
            );
            setProcessed(true);
            setInProgress(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text variant={titleVariant}>Update Concern</Text>
            <DropdownList
                titleText="Seen at:"
                selected={location}
                setSelected={(val) => setLocation(val)}
                data={locations}
            />

            <Divider />

            <TimeInput
                titleText="Last Seen Time:"
                today={today}
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
                firstValue="Healthy"
                secondValue="Injured"
            />

            <Divider />

            <UploadPhotos
                titleText="Upload photo:"
                cameraOnPress={handleImageFromCamera}
                galleryOnPress={handleImageFromGallery}
                photoURI={photoURI}
                showError={true}
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
                disabled={
                    location === "" ||
                    concernDescription.trim() === "" ||
                    photoURI === "" ||
                    date > today ||
                    inProgress
                }
            />
            {error[0] && <Text>Error: {error[0].message}</Text>}
            {loading[0] && <ActivityIndicator />}
        </View>
    );
};

const UpdateFed = (props) => {
    const navigation = useNavigation();
    const {
        catID,
        name,
        photoURLs,
        gender,
        birthYear,
        sterilised,
        keyFeatures,
        concernStatus,
        concernDesc,
        formType,
        userID,
    } = props;
    const [processed, setProcessed] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const { userUpdateCatFed, loading, error } = useUserUpdateCatFed();

    // For Location Dropdown
    const [location, setLocation] = useState("");

    // For RNDateTimePicker
    // Get current time so it can be used to check against selected time
    const todayRef = useRef(new Date());
    const today = todayRef.current;
    const [date, setDate] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowTime(false);
        setDate(currentDate);
    };
    // To keep updating current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            todayRef.current = new Date();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", {
                catID: catID,
                name: name,
                gender: gender,
                birthYear: birthYear,
                sterilised: sterilised,
                keyFeatures: keyFeatures,
                photoURLs: photoURLs,
                concernStatus: concernStatus,
                concernDesc: concernDesc,
                formType: formType,
            });
        }
    }, [
        loading,
        processed,
        error,
        navigation,
        props,
        catID,
        name,
        gender,
        birthYear,
        sterilised,
        keyFeatures,
        photoURLs,
        concernStatus,
        concernDesc,
        formType,
    ]);

    const handleUpdate = async () => {
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);

            await userUpdateCatFed(props.userID, catID, date, location);
            setProcessed(true);
            setInProgress(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text variant={titleVariant}>Update Fed</Text>
            <DropdownList
                titleText="Seen at:"
                selected={location}
                setSelected={(val) => setLocation(val)}
                data={locations}
            />

            <Divider />

            <TimeInput
                titleText="Last Fed Time:"
                today={today}
                displayTime={date}
                value={date}
                onChange={onTimeChange}
                show={showTime}
                onPress={setShowTime}
            />

            <PillButton
                label="Update"
                onPress={handleUpdate}
                disabled={location === "" || date > today || inProgress}
            />
            {error[0] && <Text>Error: {error[0].message}</Text>}
            {loading[0] && <ActivityIndicator />}
        </View>
    );
};

const UpdateProfile = (props) => {
    const navigation = useNavigation();
    const {
        catID,
        name,
        photoURLs,
        gender,
        birthYear,
        sterilised,
        keyFeatures,
        concernStatus,
        concernDesc,
        formType,
        userID,
    } = props;
    const [processed, setProcessed] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const { userUpdateCatProfile, loading, error } = useUserUpdateCatProfile();

    // For Name TextInput
    const [newName, setNewName] = useState(name ? name : "");

    // For Image Picker
    const [photoURI, setPhotoURI] = useState("");
    const [photoError, setPhotoError] = useState(null);

    // For Gender Radio
    const [newGender, setNewGender] = useState(gender ? gender : "F");

    // For BirthYear Spinner
    const [year, setYear] = useState(
        birthYear ? birthYear : new Date().getFullYear()
    );

    // For New Radio
    const [isNew, setIsNew] = useState("Yes");

    // For Sterilised Radio
    const [sterile, setSterile] = useState(sterilised ? "Yes" : "No");

    // For KeyFeatures TextInput
    const [features, setFeatures] = useState(keyFeatures ? keyFeatures : "");

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", {
                catID: catID,
                name: newName,
                gender: newGender,
                birthYear: year,
                sterilised: sterile === "Yes",
                keyFeatures: features,
                photoURLs: photoURLs,
                formType: formType,
            });
        }
    }, [
        loading,
        processed,
        error,
        navigation,
        catID,
        newName,
        newGender,
        year,
        sterile,
        features,
        photoURLs,
        formType,
    ]);

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
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);

            await userUpdateCatProfile(props.userID, catID, {
                name: newName,
                photoURI: photoURI,
                gender: newGender,
                birthYear: year,
                sterilised: sterile === "Yes",
                keyFeatures: features,
                isNew: concernStatus.new ? isNew === "Yes" : false,
            });
            setProcessed(true);
            setInProgress(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text variant={titleVariant}>Update Profile</Text>
            <FormInput
                label="Name"
                placeholder="Kitty's Name"
                value={newName}
                onChangeText={setNewName}
                errorText="Please give a cute name for the cat!"
            />

            <Divider />

            <UploadPhotos
                titleText="Change profile photo:"
                cameraOnPress={handleImageFromCamera}
                galleryOnPress={handleImageFromGallery}
                photoURI={photoURI}
                showError={false}
            />

            <Divider />

            <TwoRadioInput
                titleText="Gender"
                value={newGender}
                onValueChange={(value) => setNewGender(value)}
                firstValue="F"
                secondValue="M"
            />

            <Divider />

            <NumberSpinner
                titleText="Birth Year:"
                initValue={birthYear ? birthYear : new Date().getFullYear()}
                min={new Date().getFullYear() - 30}
                max={new Date().getFullYear()}
                value={year}
                onChange={(num) => {
                    setYear(num);
                }}
            />

            <Divider />

            {concernStatus.new && (
                <>
                    <TwoRadioInput
                        titleText="Is New"
                        value={isNew}
                        onValueChange={(value) => setIsNew(value)}
                        firstText="Yes"
                        firstValue="Yes"
                        secondText="No"
                        secondValue="No"
                    />

                    <Divider />
                </>
            )}

            <TwoRadioInput
                titleText="Sterilised"
                value={sterile}
                onValueChange={(value) => setSterile(value)}
                firstValue="Yes"
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
                disabled={
                    name.trim() === "" || features.trim() === "" || inProgress
                }
            />
            {error[0] && <Text>Error: {error[0].message}</Text>}
            {loading[0] && <ActivityIndicator />}
        </View>
    );
};

const DeleteProfile = (props) => {
    const navigation = useNavigation();
    const { catID, name, photoURLs, formType } = props;
    const [processed, setProcessed] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const { userDeleteCat, loading, error } = useUserDeleteCat();

    // For Name TextInput
    const [catName, setCatName] = useState("");

    useEffect(() => {
        if (!loading[0] && processed && error[0] === null) {
            navigation.navigate("ConfirmUpdate", {
                name: name,
                photoURLs: photoURLs,
                formType: formType,
            });
        }
    }, [loading, processed, error, navigation, name, photoURLs, formType]);

    const handleDelete = async () => {
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);
            await userDeleteCat(props.userID, catID);
            setProcessed(true);
            setInProgress(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text variant={titleVariant}>Delete Profile</Text>
            <Text variant="bodyMedium">
                Deleted Profiles cannot be recovered!
            </Text>

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
                disabled={catName !== name || inProgress}
            />
            {error[0] && <Text>Error: {error[0].message}</Text>}
            {loading[0] && <ActivityIndicator />}
        </View>
    );
};

export {
    CreateProfile,
    ReportCat,
    UpdateConcern,
    UpdateFed,
    UpdateLocation,
    UpdateProfile,
    DeleteProfile,
};

const titleVariant = "titleMedium";

const styles = StyleSheet.create({
    formContainer: {
        alignItems: "center",
        width: "100%",
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 4,
    },
});
