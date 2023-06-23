import { useState } from "react";
import { FlatList, Image, View } from "react-native";
import { FAB, Portal, Provider, Text } from "react-native-paper";
import { getItemWidth } from "../../../utils/calculateItemWidths";
import { useRoute } from "@react-navigation/native";
import { useUserAddCatPicture } from "../../../utils/db/cat";
import { getAuth } from "firebase/auth";
import {
    getImageFromCamera,
    getImageFromGallery,
} from "../../../utils/db/photo";

export default function PhotoGallery() {
    const { user } = getAuth();
    const route = useRoute();
    const { catID } = route.params;
    const { userAddCatPicture, loading, error } = useUserAddCatPicture();

    const [open, setOpen] = useState(false);
    const imageSize = getItemWidth(2, 8);
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
            }
        } catch (error) {
            console.error(error);
            setPhotoError(null);
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
            }
        } catch (error) {
            console.error(error);
            setPhotoError(null);
        }
    };

    return (
        <Provider>
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
            </View>
        </Provider>
    );
}
