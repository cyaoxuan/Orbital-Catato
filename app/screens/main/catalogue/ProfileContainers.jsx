import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { IconTextField, KeyTextField } from "../../../components/InfoText";
import { CatAvatar } from "../../../components/CatAvatar";
import { formatAge, formatLastSeen, formatLastFed } from "../../../utils/formatDetails";
import { getItemWidth }  from "../../../utils/calculateItemWidths";
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
                info={cat.locationName && cat.lastSeenTime 
                    ? formatLastSeen(cat.locationName, cat.lastSeenTime)
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
                info={cat.concernStatus
                    ? cat.concernStatus.join(", ") 
                    : "Healthy"}
            />
            <IconTextField iconTextStyle={styles.iconTextStyle}
                {...rest}
                iconName="information-circle-outline"
                field="Concerns: "
                info={cat.concernDesc ? cat.concernDesc : "The cat is happy and healthy!"}
            />
        </View>
    )
}

// Render preview photos
const PreviewPhotos = ({photoURLs}) => {
    let previewPhotos;

    if (photoURLs === null) {
        return (
            <View style={styles.previewContainer}>
                <Text style={{ marginTop: 20 }}>This cat has no photos!</Text>
            </View>
        )
    } else if (photoURLs.length > 4) {
        previewPhotos = photoURLs.slice(0, 4);
    } else {
        previewPhotos = photoURLs;
    }

    const imageSize = getItemWidth(4, 8);

    return (
        <View style={styles.previewContainer}>
            {previewPhotos.map((photoURL, index) => {
                return (
                    <View key={index} testID="preview-photo">
                        <Image style={{ height: imageSize, width: imageSize, resizeMode: "cover", margin: 4 }} 
                            source={{ uri: photoURL }} />
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
                <TouchableOpacity testID="view-button"
                    onPress={onPress}>
                    <View style={{ flexDirection: "row" }}>
                        <Text variant={variant}>View All</Text>
                        <Ionicons name="chevron-forward" size={iconSize} style={{ marginHorizontal: 4 }} />
                    </View>
                </TouchableOpacity>
            </View>
            <Divider />
            <PreviewPhotos photoURLs={photoURLs ? photoURLs : null} />
        </View>
    )
}

export { AvatarContainer, KeyInfoContainer, DetailsContainer, PreviewPhotos, PhotosContainer }

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
        padding: 16
    },

    photosHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 8
    },

    previewContainer: {
        flexDirection: "row",
    }
})