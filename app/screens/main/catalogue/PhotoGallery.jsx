import { useState } from "react";
import { FlatList, Image, View } from "react-native";
import { FAB, Portal, Provider, Text } from "react-native-paper";
import { Stack } from "expo-router";
import { getItemWidth }  from "../../../utils/CalculateDimensions";
import { useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { useUserAddCatPicture } from "../../../utils/db/cat";
import { getAuth } from "firebase/auth";

export default function PhotoGallery() {
    const { user } = getAuth();
    const route = useRoute();
    const { userAddCatPicture, loading, error } = useUserAddCatPicture();

    const [open, setOpen] = useState(false);
    const imageSize = getItemWidth(2, 8);

    const getPictureFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        return result.assets[0].uri;
    }

    const handleAddImageFromGallery = async () => {
        const photoURI = await getPictureFromGallery();
        // TODO: change to cat and userid
        await userAddCatPicture("2nTIJgoSsSTWzspThZlaQJppKuk2", "PMos9bF9blNkKCnGd4c6", photoURI);
    };

    const getPictureFromCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        return result.assets[0].uri;
    };

    const handleAddImageFromCamera = async () => {
        const photoURI = await getPictureFromCamera();
        // TODO: change to cat and userid
        await userAddCatPicture("2nTIJgoSsSTWzspThZlaQJppKuk2", "PMos9bF9blNkKCnGd4c6", photoURI);
    };

    return (
        <Provider>
            <View>
                <Stack.Screen options={{ title: "Photo Gallery"}} />
                <FlatList
                    ListHeaderComponent={() => <Text variant="headlineMedium">{route.params.name} Meowmories</Text>}
                    ListHeaderComponentStyle={{ alignItems: "center" }}
                    numColumns={2}
                    contentContainerStyle={{ justifyContent: "space-around" }}
                    data={route.params.photoURLs}
                    renderItem={({item, index}) => {
                        return (
                            <View key={index}>
                                <Image style={{ height: imageSize, width: imageSize, resizeMode: "cover", margin: 8 }} 
                                source={item} />
                            </View>
                        );
                    }}
                />
                <Portal>
                    <FAB.Group style={{ position: "absolute", bottom: 10, right: 10 }}
                        open={open}
                        icon={"plus"}
                        actions={[
                            {icon: "camera", label: "Camera", onPress: handleAddImageFromCamera},
                            {icon: "image", label: "Gallery", onPress: handleAddImageFromGallery}
                        ]}
                        onStateChange={() => setOpen((prev) => !prev)}
                    />
                </Portal>
            </View>
        </Provider>
    )
}