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
import { useGetUserByID, useUserToggleCatFollow } from "../../../utils/db/user";

export default function CatProfile() {
    const { user, userRole } = useAuth();
    const route = useRoute();
    const catID = route.params.catID;
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { getCat, cat, loading, error } = useGetCat();
    const [partialCat, setPartialCat] = useState(null);

    // Get user
    const { getUserByID, user: userDB } = useGetUserByID();
    useEffect(() => {
        const fetchData = async () => {
            await getUserByID(user.uid);
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Set default value for following
    const [followed, setFollowed] = useState(false);
    useEffect(() => {
        if (userDB) {
            setFollowed(userDB.catsFollowed.includes(catID));
        }
    }, [catID, userDB]);

    // Handle cat following
    const {
        userToggleCatFollow,
        loading: loadingFollow,
        error: errorFollow,
    } = useUserToggleCatFollow();
    const changeFavourite = async () => {
        await userToggleCatFollow(user.uid, catID, !followed);
        setFollowed((prev) => !prev);
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
                followValue={followed}
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
                userRole={userRole}
            />

            <KeyInfoContainer cat={cat} variant="bodyMedium" />

            <DetailsContainer
                cat={cat}
                userRole={userRole}
                variant="bodyMedium"
                iconSize={24}
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
                    });
                }}
            />
        </ScrollView>
    );
}
