import { storage } from "../../config/firebase";
import { ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';

export const uploadImageToStorage = async (uri) => {
    const storageRef = ref(storage, 'images/' + uri.split('/').pop());
    const response = await fetch(uri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};