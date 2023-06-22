import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import {
    getImageFromCamera,
    getImageFromGallery,
    uploadImageToStorage,
} from "../../app/utils/db/photo";
import { storage } from "../../app/config/firebase";

// Mocking the necessary dependencies
jest.mock("firebase/storage", () => ({
    ref: jest.fn(),
    getDownloadURL: jest.fn(),
    uploadBytes: jest.fn()
}));

jest.mock("expo-image-picker", () => ({
    MediaTypeOptions: { Images: "images" },
    requestMediaLibraryPermissionsAsync: jest.fn(),
    requestCameraPermissionsAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
    launchCameraAsync: jest.fn()
}))

jest.mock("../../app/config/firebase", () => ({
    storage: jest.fn()
}));

// Tests
describe("getImageFromGallery", () => {
    it("throws an error when storage access is not given", async () => {
        // Mock the permission denied for media library
        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
            status: "denied"
        });

        // Assert that an error is thrown
        await expect(getImageFromGallery()).rejects.toThrowError(
            "Gallery permissions denied"
        );
    });

    it("returns null when no image is selected in gallery", async () => {
        // Mock the permission granted for media library
        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
            status: "granted"
        });

        // Mock the canceled value for image picker
        ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
            canceled: true,
            assets: [],
        });

        // Assert that null is returned
        expect(await getImageFromGallery()).toBeNull();
    });

    it("returns the correct URI when an image is selected and edited", async () => {
        // Mock the permission granted for media library
        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
            status: "granted"
        });

        const selectedImageUri = "example-uri";

        // Mock the image picker result
        ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
            canceled: false,
            assets: [{ uri: selectedImageUri }],
        });

        // Assert that the correct URI is returned
        expect(await getImageFromGallery()).toBe(selectedImageUri);
    });
});

describe("getImageFromCamera", () => {
    it("throws an error when camera access is not given", async () => {
        // Mock the permission denied for camera
        ImagePicker.requestCameraPermissionsAsync.mockResolvedValueOnce({
            statusCamera: "denied"
        });

        // Assert that an error is thrown
        await expect(getImageFromCamera()).rejects.toThrowError(
            "Camera permissions denied"
        );
    });

    it("throws an error when storage access is not given", async () => {
        // Mock the permission granted for camera and denied for media library
        ImagePicker.requestCameraPermissionsAsync.mockResolvedValueOnce({
            statusCamera: "granted"
        });

        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
            statusGallery: "denied"
        });

        // Assert that an error is thrown
        await expect(getImageFromCamera()).rejects.toThrowError(
            "Gallery permissions denied"
        );
    });

    it("returns null when no image is taken", async () => {
        // Mock the permission granted for camera and media library
        ImagePicker.requestCameraPermissionsAsync.mockResolvedValueOnce({
            statusCamera: "granted"
        });

        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
            statusGallery: "granted"
        });

        // Mock the canceled value for image picker
        ImagePicker.launchCameraAsync.mockResolvedValueOnce({
            canceled: true,
            assets: [],
        });

        // Assert that null is returned
        expect(await getImageFromCamera()).toBeNull();
    });

    it("returns the correct URI when an image is taken and edited", async () => {
        // Mock the permission granted for camera and media library
        ImagePicker.requestCameraPermissionsAsync.mockResolvedValueOnce({
            statusCamera: "granted"
        });

        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
            statusGallery: "granted"
        });

        const takenImageUri = "example-uri";

        // Mock the image picker result
        ImagePicker.launchCameraAsync.mockResolvedValueOnce({
            canceled: false,
            assets: [{ uri: takenImageUri }],
        });

        // Assert that the correct URI is returned
        expect(await getImageFromCamera()).toBe(takenImageUri);
    });
});

describe("uploadImageToStorage", () => {
    it("throws an error when URI is null", async () => {
        // Assert that an error is thrown
        await expect(uploadImageToStorage(null)).rejects.toThrowError(
            "Invalid uri (null)"
        );
    });

    it("uploads image to cloud storage and returns valid download URL", async () => {
        const mockUri = "example-uri";
        const mockDownloadURL = "example-download-url";

        // Mock the Firebase storage references and functions
        const mockStorageRef = jest.fn();
        const mockUploadBytes = jest.fn();
        const mockGetDownloadURL = jest.fn(() =>
            Promise.resolve(mockDownloadURL)
        );

        // Mock the response from fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                blob: jest.fn(() => Promise.resolve("mock-blob")),
            })
        );

        // Mock the Firebase storage functions
        ref.mockReturnValueOnce(mockStorageRef);
        uploadBytes.mockImplementationOnce(mockUploadBytes);
        getDownloadURL.mockImplementationOnce(mockGetDownloadURL);

        // Assert that the upload and download processes are called correctly
        await expect(uploadImageToStorage(mockUri)).resolves.toBe(
            mockDownloadURL
        );
        expect(ref).toHaveBeenCalledWith(storage, "images/example-uri");
        expect(global.fetch).toHaveBeenCalledWith(mockUri);
        expect(mockUploadBytes).toHaveBeenCalledWith(
            mockStorageRef,
            "mock-blob"
        );
        expect(mockGetDownloadURL).toHaveBeenCalledWith(mockStorageRef);
    });
});