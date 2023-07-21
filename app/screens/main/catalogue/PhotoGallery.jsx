import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import {
    ActivityIndicator,
    DefaultTheme,
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
import { FilterButton } from "../../../components/Button";
import {
    DeletingView,
    ImageDialog,
    ImageFAB,
    ImageItem,
} from "./GalleryComponents";
import {
    allStyles,
    screenMainColor,
    secondaryColor,
} from "../../../components/Styles";
import { TitleText } from "../../../components/Text";

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

    const imageMargins = 12;
    const imageSize = getItemWidthCols(2, imageMargins);

    // Get photoURLs and add selected prop to each of them
    const route = useRoute();
    const { catID, photoURLs, concernPhotoURLs } = route.params;

    const galleryPhotos = photoURLs
        ? photoURLs.map((photoURL) => {
              return {
                  photoURL: photoURL,
                  isSelected: false,
              };
          })
        : [];

    const concernPhotos = concernPhotoURLs
        ? concernPhotoURLs.map((photoURL) => {
              return {
                  photoURL: photoURL,
                  isSelected: false,
              };
          })
        : [];

    // For filter buttons (gallery/injured)
    const [filterValue, setFilterValue] = useState("Gallery");
    const [listPhotos, setListPhotos] = useState(galleryPhotos);
    const onFilter = (value) => {
        setFilterValue(value);
        if (value === "Concern") {
            setListPhotos(concernPhotos);
        } else {
            setListPhotos(galleryPhotos);
        }
    };

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

            if (photoURI !== "") {
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
    const handleDeleteImages = async (from) => {
        try {
            const selectedURLs = selectedImages.map((photo) => photo.photoURL);
            let newPhotoURLs;
            if (from === "Gallery") {
                newPhotoURLs = photoURLs.filter(
                    (URL) => !selectedURLs.includes(URL)
                );
                await userDeleteCatPictures(
                    user.uid,
                    catID,
                    newPhotoURLs,
                    "Gallery"
                );
            } else {
                newPhotoURLs = concernPhotoURLs.filter(
                    (URL) => !selectedURLs.includes(URL)
                );
                await userDeleteCatPictures(
                    user.uid,
                    catID,
                    newPhotoURLs,
                    "Concern"
                );
            }

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
        return <ActivityIndicator color={secondaryColor} />;
    }

    return (
        <Provider theme={lightTheme}>
            <View style={{ flex: 1, backgroundColor: screenMainColor }}>
                {deleting && (
                    <DeletingView
                        changeDeleting={changeDeleting}
                        selectedImages={selectedImages}
                        photoURLs={photoURLs}
                        filterValue={filterValue}
                        showDeleteDialog={showDeleteDialog}
                    />
                )}
                <FlatList
                    ListHeaderComponent={() => (
                        <View
                            style={{
                                alignItems: "center",
                                marginVertical: 4,
                                paddingBottom: 16,
                            }}
                        >
                            {filterValue === "Concern" ? (
                                // Flatlist header based on gallery or concern
                                <View
                                    style={{ height: 60, alignItems: "center" }}
                                >
                                    <TitleText
                                        variant="headlineSmall"
                                        text={
                                            route.params.name +
                                            " Concern Photos"
                                        }
                                    />
                                    <Text
                                        variant="bodyLarge"
                                        style={[
                                            allStyles.bodyText,
                                            {
                                                textAlign: "center",
                                                marginHorizontal: 16,
                                            },
                                        ]}
                                    >
                                        Uploaded from concern update forms
                                    </Text>
                                </View>
                            ) : (
                                <View
                                    style={{ height: 60, alignItems: "center" }}
                                >
                                    <TitleText
                                        variant="headlineMedium"
                                        text={route.params.name + " Meowmories"}
                                    />
                                    <Text
                                        variant="bodyLarge"
                                        style={[
                                            allStyles.bodyText,
                                            {
                                                textAlign: "center",
                                                marginHorizontal: 16,
                                            },
                                        ]}
                                    >
                                        Profile picture and gallery photos
                                    </Text>
                                </View>
                            )}
                            <FilterButton
                                filterValue={filterValue}
                                onValueChange={onFilter}
                                disabled={deleting}
                                firstValue="Gallery"
                                secondValue="Concern"
                            />
                        </View>
                    )}
                    ListHeaderComponentStyle={{ alignItems: "center" }}
                    numColumns={2}
                    contentContainerStyle={{
                        justifyContent: "space-between",
                    }}
                    data={listPhotos}
                    extraData={selectedImages}
                    renderItem={({ item, index }) => {
                        return (
                            <ImageItem
                                item={item}
                                index={index}
                                deleting={deleting}
                                imageOnPress={() => selectImage(item)}
                                imageSize={imageSize}
                                imageMargins={imageMargins}
                            />
                        );
                    }}
                />

                {userRole && userRole.isCaretaker && (
                    <>
                        <Portal>
                            <ImageFAB
                                open={open}
                                setOpen={setOpen}
                                handleAddImageFrom={handleAddImageFrom}
                                changeDeleting={changeDeleting}
                                filterValue={filterValue}
                            />
                        </Portal>

                        <Portal>
                            <ImageDialog
                                visible={dialogVisible}
                                deleting={deleting}
                                dialogText={dialogText}
                                filterValue={filterValue}
                                handleDeleteImages={handleDeleteImages}
                                backHideDialog={backHideDialog}
                                confirmHideDialog={confirmHideDialog}
                            />
                        </Portal>
                    </>
                )}
            </View>
        </Provider>
    );
}

const lightTheme = {
    ...DefaultTheme,
    mode: "light",
    dark: false,
};
