import { ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useIsFocused, useRoute } from "@react-navigation/native";
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
import { useGetUserByID, useUserToggleCatFollow } from "../../../utils/db/user";
import {
    screenSecondaryColor,
    secondaryColor,
} from "../../../components/Styles";
import { ErrorText } from "../../../components/Text";
import { getItemWidthFrac } from "../../../utils/calculateItemWidths";
import { Image } from "react-native";

export default function CatProfile() {
    const { user, userRole } = useAuth();
    const route = useRoute();
    const catID = route.params.catID;
    const navigation = useNavigation();
    const imageSize = getItemWidthFrac(3 / 4);
    // For refreshing page when in focus
    const isFocused = useIsFocused();

    const { getCat, cat, loading, error } = useGetCat();
    const [partialCat, setPartialCat] = useState(null);

    // Get user
    const { getUserByID, user: userDB } = useGetUserByID();
    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                await getUserByID(user.uid);
            };

            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Set default value for following
    const [followed, setFollowed] = useState(false);
    useEffect(() => {
        if (userDB) {
            setFollowed(
                userDB.catsFollowed && userDB.catsFollowed.includes(catID)
            );
        }
    }, [catID, userDB]);

    // Handle cat following
    const {
        userToggleCatFollow,
        loading: loadingFollow,
        error: errorFollow,
    } = useUserToggleCatFollow();
    const changeFavourite = async () => {
        try {
            await userToggleCatFollow(user.uid, catID, !followed);
            setFollowed((prev) => !prev);
        } catch (error) {
            console.error(error);
        }
    };

    // Get cat data
    useEffect(() => {
        const fetchData = async () => {
            await getCat(catID);
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [catID, isFocused]);

    // Process cat data once it is ready
    useEffect(() => {
        if (cat) {
            const processData = async () => {
                await Promise.all([
                    autoProcessMissing(cat),
                    autoProcessUnfed(cat),
                ]);
            };
            processData();

            // Partial cat is to pass to update
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
            }))(cat);
            setPartialCat(partialCatTemp);
        }
    }, [cat]);

    if (!user || !userRole) {
        return <ActivityIndicator color={secondaryColor} />;
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
                {error[0] && <ErrorText text={"Error: " + error[0].message} />}
                {loading[0] && <ActivityIndicator color={secondaryColor} />}
            </View>
        );
    }

    return (
        <ScrollView
            testID="profile-container"
            style={{ backgroundColor: screenSecondaryColor }}
        >
            <View
                style={{
                    alignItems: "center",
                    width: "100%",
                    paddingBottom: 16,
                }}
            >
                <Image
                    source={
                        cat.photoURLs
                            ? { uri: cat.photoURLs[0] }
                            : require("../../../../assets/placeholder.png")
                    }
                    resizeMode="cover"
                    style={{
                        width: imageSize,
                        height: imageSize,
                        borderRadius: 20,
                    }}
                />
            </View>
            <AvatarContainer
                name={cat.name}
                photoURL={cat.photoURLs[0]}
                imageSize={imageSize}
                followValue={followed}
                followOnPress={changeFavourite}
                loadingFollow={loadingFollow}
                errorFollow={errorFollow}
                updateValue={true}
                updateOnPress={() =>
                    navigation.navigate("update", {
                        screen: "UpdateOptions",
                        initial: false,
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
                userRole={userRole}
            />

            <KeyInfoContainer cat={cat} variant="bodyMedium" />

            <DetailsContainer
                cat={cat}
                userRole={userRole}
                variant="bodyMedium"
                iconSize={20}
            />

            <PhotosContainer
                photoURLs={cat.photoURLs}
                variant="bodyLarge"
                iconSize={24}
                onPress={() => {
                    navigation.navigate("PhotoGallery", {
                        catID: cat.catID,
                        name: cat.name,
                        photoURLs: cat.photoURLs,
                        concernPhotoURLs:
                            cat.concernPhotoURLs === undefined
                                ? null
                                : cat.concernPhotoURLs,
                    });
                }}
            />
        </ScrollView>
    );
}
