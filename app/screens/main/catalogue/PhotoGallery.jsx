import { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import {
    ActivityIndicator,
    Button,
    DefaultTheme,
    Dialog,
    FAB,
    IconButton,
    Portal,
    Provider,
    Text,
} from "react-native-paper";
import { getItemWidthCols } from "../../../utils/calculateItemWidths";
import { useRoute } from "@react-navigation/native";
import {
    useUserAddCatPicture,
    useUserDeleteCatPictures,
} from "../../../utils/db/cat";
import {
    getImageFromCamera,
    getImageFromGallery,
} from "../../../utils/db/photo";
import { useNavigation } from "expo-router";
import { useAuth } from "../../../utils/context/auth";
import Ionicons from "@expo/vector-icons/Ionicons";

const lightTheme = {
    ...DefaultTheme,
    mode: "light",
    dark: false,
};

export default function PhotoGallery() {
    const { user, userRole } = useAuth();
    const navigation = useNavigation();
    const {
        userAddCatPicture,
        loading: addLoading,
        error: addError,
    } = useUserAddCatPicture();
    const {
        userDeleteCatPictures,
        loading: deleteLoading,
        error: deleteError,
    } = useUserDeleteCatPictures();
    const imageSize = getItemWidthCols(2, 8);

    // Get photoURLs and add selected prop to each of them
    const route = useRoute();
    const { catID, photoURLs, concernPhotoURLs } = route.params;
    const photos = photoURLs.map((photoURL) => {
        return {
            photoURL: photoURL,
            isSelected: false,
        };
    });
    const [listPhotos, setListPhotos] = useState(photos);

    // For image FAB
    const [open, setOpen] = useState(false);

    // For Confirm/Delete Image Upload Dialog
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogText, setDialogText] = useState("");
    const showDialog = () => setDialogVisible(true);
    const confirmHideDialog = () => {
        setDialogText("");
        setDialogVisible(false);
        navigation.navigate("CatProfile", { catID: catID });
    };
    const backHideDialog = () => {
        setDialogText("");
        setDialogVisible(false);
    };

    // For uploading images
    const handleAddImageFrom = async (source) => {
        try {
            const photoURI =
                source === "Gallery"
                    ? await getImageFromGallery()
                    : await getImageFromCamera();

            if (photoURI !== null) {
                await userAddCatPicture(user.uid, catID, photoURI);
                setDialogText(
                    "Image upload confirmed! Thank you for your contribution!"
                );
            }
        } catch (error) {
            console.error(error);
            setDialogText("Error uploading image :(\n" + error.message);
        }
    };

    // Showing Dialog
    useEffect(() => {
        if (dialogText !== "") {
            showDialog();
        }
    }, [dialogText]);

    // For deleting state
    const [deleting, setDeleting] = useState(false);
    const changeDeleting = () => {
        setDeleting((prev) => !prev);
        if (deleting) {
            setSelectedImages([]);
            setListPhotos(
                listPhotos.map((photo) => {
                    return {
                        ...photo,
                        isSelected: false,
                    };
                })
            );
        }
    };

    // For selecting images
    const [selectedImages, setSelectedImages] = useState([]);

    const selectImage = (photo) => {
        if (photo.isSelected) {
            photo.isSelected = false;
            setSelectedImages(
                selectedImages.filter(
                    (items) => items.photoURL !== photo.photoURL
                )
            );
        } else {
            photo.isSelected = true;
            setSelectedImages([...selectedImages, photo]);
        }
    };

    const showDeleteDialog = () => {
        setDialogText(
            "Are you sure you want to delete these images? They cannot be recovered after deletion."
        );
    };

    // For deleting images
    const handleDeleteImages = async () => {
        try {
            const selectedURLs = selectedImages.map((photo) => photo.photoURL);
            const newPhotoURLs = photoURLs.filter(
                (URL) => !selectedURLs.includes(URL)
            );
            await userDeleteCatPictures(
                user.uid,
                catID,
                newPhotoURLs,
                "Gallery"
            );
            setListPhotos(
                newPhotoURLs.map((photoURL) => {
                    return {
                        photoURL: photoURL,
                        isSelected: false,
                    };
                })
            );
            changeDeleting();
            setDialogText("Delete Confirmed.");
        } catch (error) {
            console.error(error);
            changeDeleting();
            setDialogText("Error deleting images :(\n" + error.message);
        }
    };

    if (!user || !userRole) {
        return <ActivityIndicator />;
    }

    return (
        <Provider theme={lightTheme}>
            <View style={{ flex: 1 }}>
                {deleting && (
                    <View
                        style={{
                            height: 50,
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "mistyrose",
                        }}
                    >
                        <IconButton
                            icon={() => (
                                <Ionicons
                                    name="close-circle-outline"
                                    size={20}
                                    color="#663399"
                                    style={{ alignSelf: "center" }}
                                />
                            )}
                            onPress={changeDeleting}
                        />
                        <Text>
                            Selected Items: {selectedImages.length}
                            {selectedImages.length === photoURLs.length && (
                                <Text style={{ color: "#BA1A1A" }}>
                                    {" (Cannot Delete All)"}
                                </Text>
                            )}
                        </Text>
                        <Button
                            mode="text"
                            onPress={showDeleteDialog}
                            disabled={
                                selectedImages.length === 0 ||
                                selectedImages.length === photoURLs.length
                            }
                        >
                            Delete
                        </Button>
                    </View>
                )}
                <FlatList
                    ListHeaderComponent={() => (
                        <Text variant="headlineMedium">
                            {route.params.name} Meowmories
                        </Text>
                    )}
                    ListHeaderComponentStyle={{ alignItems: "center" }}
                    numColumns={2}
                    contentContainerStyle={{ justifyContent: "space-around" }}
                    data={listPhotos}
                    extraData={selectedImages}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={!deleting}
                                onPress={() => selectImage(item)}
                                style={{
                                    height: imageSize + 30 + 8,
                                    width: imageSize + 8,
                                }}
                            >
                                <View key={index} testID="gallery-photo">
                                    <Image
                                        style={{
                                            height: imageSize,
                                            width: imageSize,
                                            resizeMode: "cover",
                                            margin: 8,
                                        }}
                                        source={{ uri: item.photoURL }}
                                    />

                                    {deleting && (
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                height: 30,
                                                marginHorizontal: 8,
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Text>
                                                {item.isSelected
                                                    ? "Selected"
                                                    : "Not Selected"}
                                            </Text>
                                            <Ionicons
                                                name={
                                                    item.isSelected
                                                        ? "checkmark-circle"
                                                        : "checkmark-circle-outline"
                                                }
                                                size={20}
                                                color={"#663399"}
                                            />
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />

                {userRole && userRole.isCaretaker && (
                    <>
                        <Portal>
                            <FAB.Group
                                testID="fab-group"
                                style={{
                                    position: "absolute",
                                    bottom: 10,
                                    right: 10,
                                }}
                                open={open}
                                icon={open ? "close" : "plus"}
                                actions={[
                                    {
                                        icon: () => (
                                            <Ionicons
                                                name="camera"
                                                size={20}
                                                color="#663399"
                                                style={{ alignSelf: "center" }}
                                            />
                                        ),
                                        label: "Camera",
                                        onPress: () =>
                                            handleAddImageFrom("Camera"),
                                    },
                                    {
                                        icon: () => (
                                            <Ionicons
                                                name="image"
                                                size={20}
                                                color="#663399"
                                                style={{ alignSelf: "center" }}
                                            />
                                        ),
                                        label: "Gallery",
                                        onPress: () =>
                                            handleAddImageFrom("Gallery"),
                                    },
                                    {
                                        icon: () => (
                                            <Ionicons
                                                name="trash"
                                                size={20}
                                                color="#663399"
                                                style={{ alignSelf: "center" }}
                                            />
                                        ),
                                        label: "Delete",
                                        onPress: changeDeleting,
                                    },
                                ]}
                                onStateChange={() => setOpen((prev) => !prev)}
                            />
                        </Portal>

                        <Portal>
                            <Dialog
                                visible={dialogVisible}
                                onDismiss={backHideDialog}
                            >
                                <Dialog.Title>
                                    {deleting || dialogText.includes("Delete")
                                        ? "Image Deletion"
                                        : "Image Upload"}
                                </Dialog.Title>
                                <Dialog.Content>
                                    <Text variant="bodyMedium">
                                        {dialogText}
                                    </Text>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    {deleting && (
                                        <>
                                            <Button
                                                onPress={handleDeleteImages}
                                            >
                                                Confirm Delete
                                            </Button>
                                            <Button onPress={backHideDialog}>
                                                Back
                                            </Button>
                                        </>
                                    )}
                                    {!deleting && (
                                        <Button
                                            onPress={
                                                dialogText.includes("Error")
                                                    ? backHideDialog
                                                    : confirmHideDialog
                                            }
                                        >
                                            Done
                                        </Button>
                                    )}
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                    </>
                )}
            </View>
        </Provider>
    );
}
