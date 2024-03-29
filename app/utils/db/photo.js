import { storage } from "../../config/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

// Error handling is not done in functions here as they will only be called with other db utils,
// which will catch the error and pass the state to the corresponding screens.
export const getImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
        throw new Error("Gallery permissions denied");
    }

    let uri;
    await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    }).then((img) => (uri = img.canceled ? "" : img.assets[0].uri));

    return uri;
};

export const getImageFromCamera = async () => {
    const { status: statusCamera } =
        await ImagePicker.requestCameraPermissionsAsync();
    if (statusCamera !== "granted") {
        throw new Error("Camera permissions denied");
    }

    const { status: statusGallery } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (statusGallery !== "granted") {
        throw new Error("Gallery permissions denied");
    }

    let uri;
    await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    }).then((img) => (uri = img.canceled ? "" : img.assets[0].uri));

    return uri;
};

export const uploadImageToStorage = async (uri) => {
    if (uri === null) {
        throw new Error("Invalid uri (null)");
    }

    const storageRef = ref(storage, "images/" + uri.split("/").pop());
    const response = await fetch(uri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};
