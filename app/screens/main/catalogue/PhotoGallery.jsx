import { useEffect, useState } from "react";
import { FlatList, Image, View } from "react-native";
import {
    Button,
    DefaultTheme,
    Dialog,
    FAB,
    Portal,
    Provider,
    Text,
} from "react-native-paper";
import { getItemWidthCols } from "../../../utils/calculateItemWidths";
import { useRoute } from "@react-navigation/native";
import { useUserAddCatPicture } from "../../../utils/db/cat";
import { getAuth } from "firebase/auth";
import {
    getImageFromCamera,
    getImageFromGallery,
} from "../../../utils/db/photo";
import { useNavigation } from "expo-router";

const lightTheme = {
    ...DefaultTheme,
    mode: "light",
    dark: false,
};

export default function PhotoGallery() {
    const { user } = getAuth();
    const navigation = useNavigation();
    const route = useRoute();
    const { catID } = route.params;
    const { userAddCatPicture, loading, error } = useUserAddCatPicture();

    // For Confirm Image Upload Dialog
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogText, setDialogText] = useState("");
    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => {
        setDialogVisible(false);
        navigation.navigate("CatProfile", { catID: catID });
    };

    // For image FAB
    const [open, setOpen] = useState(false);
    const imageSize = getItemWidthCols(2, 8);
    const [photoError, setPhotoError] = useState(null);

    const handleAddImageFromGallery = async () => {
        try {
            setPhotoError(null);
            const photoURI = await getImageFromGallery();
            if (photoURI !== null) {
                // TODO: change to cat and userid
                await userAddCatPicture(
                    "2nTIJgoSsSTWzspThZlaQJppKuk2",
                    catID,
                    photoURI
                );
                setDialogText(
                    "Image upload from gallery confirmed! Thank you for your contribution!"
                );
            }
        } catch (error) {
            console.error(error);
            setPhotoError(null);
            setDialogText("Error uploading image from gallery :(");
        }
    };

    const handleAddImageFromCamera = async () => {
        try {
            setPhotoError(null);
            const photoURI = await getImageFromCamera();
            if (photoURI !== null) {
                // TODO: change to cat and userid
                await userAddCatPicture(
                    "2nTIJgoSsSTWzspThZlaQJppKuk2",
                    catID,
                    photoURI
                );
                setDialogText(
                    "Image upload from camera confirmed! Thank you for your contribution!"
                );
            }
        } catch (error) {
            console.error(error);
            setPhotoError(null);
            setDialogText("Error uploading image from camera :(");
        }
    };

    useEffect(() => {
        if (dialogText !== "") {
            showDialog();
        }
    }, [dialogText]);

    return (
        <Provider theme={lightTheme}>
            <View>
                <FlatList
                    ListHeaderComponent={() => (
                        <Text variant="headlineMedium">
                            {route.params.name} Meowmories
                        </Text>
                    )}
                    ListHeaderComponentStyle={{ alignItems: "center" }}
                    numColumns={2}
                    contentContainerStyle={{ justifyContent: "space-around" }}
                    data={route.params.photoURLs}
                    renderItem={({ item, index }) => {
                        return (
                            <View key={index} testID="gallery-photo">
                                <Image
                                    style={{
                                        height: imageSize,
                                        width: imageSize,
                                        resizeMode: "cover",
                                        margin: 8,
                                    }}
                                    source={{ uri: item }}
                                />
                            </View>
                        );
                    }}
                />
                <Portal>
                    <FAB.Group
                        testID="fab-group"
                        style={{ position: "absolute", bottom: 10, right: 10 }}
                        open={open}
                        icon={open ? "close" : "plus"}
                        actions={[
                            {
                                icon: "camera",
                                label: "Camera",
                                onPress: handleAddImageFromCamera,
                            },
                            {
                                icon: "image",
                                label: "Gallery",
                                onPress: handleAddImageFromGallery,
                            },
                        ]}
                        onStateChange={() => setOpen((prev) => !prev)}
                    />
                </Portal>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                        <Dialog.Title>Image Upload</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">{dialogText}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>Done</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </Provider>
    );
}
