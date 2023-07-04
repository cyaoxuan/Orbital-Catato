import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { PillButton } from "../../../components/Button";
import {
    AvatarContainer,
    KeyInfoContainer,
    DetailsContainer,
    PhotosContainer,
} from "./ProfileContainers";
import { useEffect, useState } from "react";
import {
    autoProcessMissing,
    autoProcessUnfed,
    useGetCat,
} from "../../../utils/db/cat";
import { useAuth } from "../../../utils/context/auth";

export default function CatProfile() {
    const { userRole } = useAuth();
    const route = useRoute();
    const catID = route.params.catID;
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { getCat, cat, loading, error } = useGetCat();
    const [partialCat, setPartialCat] = useState(null);

    const [favourite, setFavourite] = useState(false);
    const changeFavourite = () => setFavourite((prev) => !prev);

    useEffect(() => {
        const fetchData = async () => {
            await getCat(catID);
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [catID, isFocused]);

    useEffect(() => {
        if (cat) {
            const processData = async () => {
                await Promise.all([
                    autoProcessMissing(cat),
                    autoProcessUnfed(cat),
                ]);
            };
            processData();

            const partialCatTemp = (({
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
            }) => ({
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
            }))(cat);
            setPartialCat(partialCatTemp);
        }
    }, [cat]);

    if (!userRole) {
        return <ActivityIndicator />;
    }

    if (!cat) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {error[0] && <Text>Error: {error[0].message}</Text>}
                {loading[0] && <ActivityIndicator />}
            </View>
        );
    }

    return (
        <ScrollView testID="profile-container">
            <AvatarContainer
                name={cat.name}
                photoURL={cat.photoURLs[0]}
                followValue={favourite}
                followOnPress={changeFavourite}
                updateValue={true}
                updateOnPress={() =>
                    navigation.navigate("update", {
                        screen: "UpdateOptions",
                        params: { ...partialCat },
                    })
                }
                locationValue={cat.lastSeenLocation}
                locationOnPress={() => {
                    navigation.navigate("Map", {
                        catID: cat.catID,
                        location: cat.lastSeenLocation,
                    });
                }}
            />

            <KeyInfoContainer cat={cat} variant="bodyMedium" />

            <DetailsContainer cat={cat} variant="bodyMedium" iconSize={24} />

            <PhotosContainer
                photoURLs={cat.photoURLs}
                variant="bodyLarge"
                iconSize={24}
                onPress={() => {
                    navigation.navigate("PhotoGallery", {
                        catID: cat.catID,
                        name: cat.name,
                        photoURLs: cat.photoURLs,
                    });
                }}
            />
        </ScrollView>
    );
}
