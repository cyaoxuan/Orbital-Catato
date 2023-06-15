import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { IconTextField, KeyTextField } from "../../../components/InfoText";
import { CatAvatar } from "../../../components/CatAvatar";
import { dateTimeOptions } from "../../../data/DateTimeOptions";
import { getItemWidth }  from "../../../utils/CalculateDimensions";
import Ionicons from "@expo/vector-icons/Ionicons";

// Avatar Container
const AvatarContainer = ({name, photoURL}) => {
    return (
        <View style={styles.avatarContainer}>
            <CatAvatar size={200}
                photoURL={photoURL}
                variant="headlineLarge"
                name={name}
            />
        </View>
    )
}

// Format Age Field
function formatAge(birthYear) {
    const currYear = new Date().getFullYear();
    return (currYear - birthYear) + "y";
}

// Key Info Container (Gender, Age, Sterilised)
const KeyInfoContainer = ({cat, variant}) => {
    return (
        <View style={styles.keyInfoContainer}>
            <KeyTextField
                variant={variant}
                field="Gender"
                info={cat.gender ? cat.gender : "?"}
            />
            <KeyTextField
                variant={variant}
                field="Age"
                info={cat.birthYear ? formatAge(cat.birthYear) : "?"}
            />
            <KeyTextField
                variant={variant}
                field="Sterilised"
                info={cat.sterilised ? "Yes" : "No"}
            />
        </View>
    )
}

// Format Last Seen Field
function formatLastSeen(lastSeenLocation, lastSeenTime) {
    const lastSeenTimeString = lastSeenTime.toLocaleString("en-GB", dateTimeOptions);
    let today = new Date();
    // lastSeenTime.toDate() when using TimeStamp
    // duration in hours
    let duration = (today - lastSeenTime) / 3600000;
    let durationString;
    if (duration >= 24) {
        durationString = Math.floor(duration / 24) + "d";
    } else {
        durationString = Math.floor(duration) + "h";
    }

    return `${lastSeenLocation}, ${lastSeenTimeString} (${durationString} ago)`;
}

// Format Last Fed Field
function formatLastFed(lastFedTime) {
    const lastFedTimeString = lastFedTime.toLocaleString("en-GB", dateTimeOptions);
    let today = new Date();
    // lastFedTime.toDate() when using TimeStamp
    // duration in hours
    let duration = (today - lastFedTime) / 3600000;
    let durationString;
    if (duration >= 24) {
        durationString = Math.floor(duration / 24) + "d";
    } else {
        durationString = Math.floor(duration) + "h";
    }

    return `${lastFedTimeString} (${durationString} ago)`;
}

// Details Container
const DetailsContainer = ({cat, ...rest}) => {
    return (
        <View style={styles.detailsContainer}>
            <IconTextField iconTextStyle={styles.iconTextStyle}
                {...rest}
                iconName="star-outline"
                field="Key Features: "
                info={cat.keyFeatures ? cat.keyFeatures : "Unknown"}
            />
            <IconTextField iconTextStyle={styles.iconTextStyle}
                {...rest}
                iconName="location-outline"
                field="Last Seen: "
                info={cat.lastSeenLocation && cat.lastSeenTime 
                    ? formatLastSeen(cat.lastSeenLocation, cat.lastSeenTime)
                    : "Unknown"}
            />
            <IconTextField iconTextStyle={styles.iconTextStyle}
                {...rest}
                iconName="time-outline"
                field="Last Fed: "
                info={cat.lastFedTime ? formatLastFed(cat.lastFedTime) : "Unknown"}
            />
            <IconTextField iconTextStyle={styles.iconTextStyle}
                {...rest}
                iconName="alert-circle-outline"
                field="Concern Status: "
                info={cat.concernStatus.length != 0
                    ? cat.concernStatus.join(", ") 
                    : "Healthy"}
            />
            <IconTextField iconTextStyle={styles.iconTextStyle}
                {...rest}
                iconName="information-circle-outline"
                field="Concerns: "
                info={cat.concernDesc ? cat.concernDesc : cat.name + "is happy and healthy!"}
            />
        </View>
    )
}

// Render preview photos
const PreviewPhotos = ({photoURLs}) => {
    let previewPhotos;

    if (!photoURLs) {
        return (
            <View style={styles.previewContainer}>
                <Text>This cat has no photos!</Text>
            </View>
        )
    } else if (photoURLs.length > 4) {
        previewPhotos = photoURLs.slice(0, 4);
    } else {
        previewPhotos = photoURLs;
    }

    const imageSize = getItemWidth(4, 4);

    return (
        <View style={styles.previewContainer}>
            {previewPhotos.map((photoURL, index) => {
                return (
                    <View key={index}>
                        <Image style={{ height: imageSize, width: imageSize, resizeMode: "cover", margin: 4 }} 
                            source={photoURL} />
                    </View>
                )
            })}
        </View>
    )
}

// Photos Container
const PhotosContainer = ({photoURLs, variant, iconSize, onPress}) => {
    return (
        <View style={styles.photosContainer}>
            <View style={styles.photosHeader}>
                <Text variant={variant}>Photos</Text>
                <TouchableOpacity
                    onPress={onPress}>
                    <View style={{ flexDirection: "row" }}>
                        <Text variant={variant}>View All</Text>
                        <Ionicons name="chevron-forward" size={iconSize} style={{ marginHorizontal: 4 }} />
                    </View>
                </TouchableOpacity>
            </View>
            <Divider />
            <PreviewPhotos photoURLs={photoURLs} />
        </View>
    )
}

export { AvatarContainer, KeyInfoContainer, DetailsContainer, PhotosContainer }

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: "center", 
        justifyContent: "center", 
        padding: 15
    },

    keyInfoContainer: {
        flexDirection: "row", 
        justifyContent: "space-evenly", 
        padding: 15, 
        backgroundColor: "lightgrey"
    },

    detailsContainer: {
        justifyContent: "space-evenly", 
        padding: 15
    },

    iconTextStyle: {
        margin: 8
    },

    photosContainer: {
        padding: 15
    },

    photosHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 8
    },

    previewContainer: {
        flexDirection: "row"
    }
})