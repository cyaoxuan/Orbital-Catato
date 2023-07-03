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
    useUserUpdateCatFoster,
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
                "2nTIJgoSsSTWzspThZlaQJppKuk2",
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
        } else {
            setInProgress(true);
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
                onChange={(num) => {
                    setYear(num);
                }}
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
                disabled={
                    name.trim() === "" ||
                    features.trim() === "" ||
                    photoURI === "" ||
                    inProgress
                }
            />
            {error[0] && (inProgress || setInProgress(false)) && (
                <Text>Error: {error[0].message}</Text>
            )}
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
                "2nTIJgoSsSTWzspThZlaQJppKuk2",
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
        } else {
            setInProgress(true);
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
                disabled={
                    location === "" ||
                    concernDescription.trim() === "" ||
                    photoURI === "" ||
                    date > today ||
                    inProgress
                }
            />
            {error[0] && (inProgress || setInProgress(false)) && (
                <Text>Error: {error[0].message}</Text>
            )}
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
        isFostered,
        fosterReason,
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
                isFostered: isFostered,
                fosterReason: fosterReason,
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
        isFostered,
        fosterReason,
        concernStatus,
        concernDesc,
    ]);

    const handleUpdate = async () => {
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);
            // TODO: change to cat and userid
            await userUpdateCatLocation(
                "2nTIJgoSsSTWzspThZlaQJppKuk2",
                catID,
                location,
                date
            );
            setProcessed(true);
            setInProgress(false);
        } else {
            setInProgress(true);
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
            {error[0] && (inProgress || setInProgress(false)) && (
                <Text>Error: {error[0].message}</Text>
            )}
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
        isFostered,
        fosterReason,
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
        concernStatus && concernStatus.includes("Injured")
            ? "Injured"
            : "Healthy"
    );

    // For Location Dropdown
    const [location, setLocation] = useState("");

    // For ConcernDesc TextInput
    const [concernDescription, setConcernDescription] = useState(
        concernDesc ? concernDesc : ""
    );

    // For RNDateTimePicker
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
                concernStatus:
                    (concern === "Injured" &&
                        concernStatus.includes(concern)) ||
                    (concern === "healthy" && !concernStatus.includes(concern))
                        ? concernStatus
                        : concern === "Injured"
                        ? concernStatus.push(concern)
                        : concernStatus.filter(
                              (status) => status !== "Injured"
                          ),
                concernDesc: concernDescription,
                isFostered: isFostered,
                fosterReason: fosterReason,
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
        isFostered,
        fosterReason,
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
            setInProgress(false);
        } else {
            setInProgress(true);
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
            {error[0] && (inProgress || setInProgress(false)) && (
                <Text>Error: {error[0].message}</Text>
            )}
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
        isFostered,
        fosterReason,
        formType,
        userID,
    } = props;
    const [processed, setProcessed] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const { userUpdateCatFed, loading, error } = useUserUpdateCatFed();

    // For Location Dropdown
    const [location, setLocation] = useState("");

    // For RNDateTimePicker
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
                isFostered: isFostered,
                fosterReason: fosterReason,
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
        isFostered,
        fosterReason,
        formType,
    ]);

    const handleUpdate = async () => {
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);
            // TODO: change to cat and userid
            await userUpdateCatFed(
                "2nTIJgoSsSTWzspThZlaQJppKuk2",
                catID,
                date,
                location
            );
            setProcessed(true);
            setInProgress(false);
        } else {
            setInProgress(true);
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
            {error[0] && (inProgress || setInProgress(false)) && (
                <Text>Error: {error[0].message}</Text>
            )}
            {loading[0] && <ActivityIndicator />}
        </View>
    );
};

const UpdateFoster = (props) => {
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
        isFostered,
        fosterReason,
        formType,
        userID,
    } = props;
    const [processed, setProcessed] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const { userUpdateCatFoster, loading, error } = useUserUpdateCatFoster();

    // For Foster Radio
    const [fostered, setFostered] = useState(isFostered ? "Yes" : "No");

    // For FosterReason TextInput
    const [fosterDesc, setFosterDesc] = useState(
        fosterReason ? fosterReason : ""
    );

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
                isFostered: fostered,
                fosterReason: fosterDesc,
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
        fostered,
        fosterDesc,
        formType,
    ]);

    const handleUpdate = async () => {
        if (!inProgress) {
            setInProgress(true);
            setProcessed(false);
            // TODO: change to cat and userid
            await userUpdateCatFoster(
                "2nTIJgoSsSTWzspThZlaQJppKuk2",
                catID,
                fostered,
                fosterDesc
            );
            setProcessed(true);
            setInProgress(false);
        } else {
            setInProgress(true);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text variant={titleVariant}>Update Foster</Text>
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
                disabled={fosterDesc.trim() === "" || inProgress}
            />
            {error[0] && (inProgress || setInProgress(false)) && (
                <Text>Error: {error[0].message}</Text>
            )}
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
        formType,
        isFostered,
        fosterReason,
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
                isFostered: isFostered,
                fosterReason: fosterReason,
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
        isFostered,
        fosterReason,
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
            // TODO: change to cat and userid
            await userUpdateCatProfile("2nTIJgoSsSTWzspThZlaQJppKuk2", catID, {
                name: newName,
                photoURI: photoURI,
                gender: newGender,
                birthYear: year,
                sterilised: sterile === "Yes",
                keyFeatures: features,
            });
            setProcessed(true);
            setInProgress(false);
        } else {
            setInProgress(true);
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
                onChange={(num) => {
                    setYear(num);
                }}
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
                disabled={
                    name.trim() === "" ||
                    features.trim() === "" ||
                    inProgress
                }
            />
            {error[0] && (inProgress || setInProgress(false)) && (
                <Text>Error: {error[0].message}</Text>
            )}
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
            await userDeleteCat("2nTIJgoSsSTWzspThZlaQJppKuk2", catID);
            setProcessed(true);
            setInProgress(false);
        } else {
            setInProgress(true);
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
            {error[0] && (inProgress || setInProgress(false)) && (
                <Text>Error: {error[0].message}</Text>
            )}
            {loading[0] && <ActivityIndicator />}
        </View>
    );
};

export {
    CreateProfile,
    ReportCat,
    UpdateConcern,
    UpdateFed,
    UpdateFoster,
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
