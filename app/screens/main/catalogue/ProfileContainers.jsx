import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Divider, Text } from "react-native-paper";
import { IconTextField, KeyTextField } from "../../../components/InfoText";
import {
    formatAge,
    formatLastSeen,
    formatLastFed,
} from "../../../utils/formatDetails";
import { getItemWidthCols } from "../../../utils/calculateItemWidths";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
    allStyles,
    screenMainColor,
    secondaryColor,
} from "../../../components/Styles";
import { BodyText, ErrorText, TitleText } from "../../../components/Text";
import { SaladSmudgeCat } from "../../../components/CatDrawing";

// Avatar Container for profile photo, name and buttons
// props: name (string), photoURL (string), imageSize (number), userRole (object),
// followValue (hook value), followOnPress (callback), loadingFollow (array), errorFollow (array),
// updateValue (hook value), updateOnPress (callback), locationValue (hook value), locationOnPress (callback)
const AvatarContainer = ({
    name,
    followValue,
    followOnPress,
    loadingFollow,
    errorFollow,
    updateValue,
    updateOnPress,
    locationValue,
    locationOnPress,
    userRole,
}) => {
    const buttonColor = secondaryColor;

    return (
        <View style={styles.avatarContainer}>
            {userRole && userRole.isUser && (
                // only show follow and update button for users
                <>
                    <TitleText variant="displaySmall" text={name} />
                    <View
                        style={{
                            alignItems: "center",
                            marginVertical: 4,
                            width: "100%",
                        }}
                    >
                        <Button
                            style={{
                                width: "80%",
                                borderColor: buttonColor,
                            }}
                            mode={followValue ? "contained" : "outlined"}
                            textColor={followValue ? "white" : buttonColor}
                            buttonColor={
                                followValue ? buttonColor : "transparent"
                            }
                            icon={() => (
                                <Ionicons
                                    name="notifications"
                                    size={20}
                                    color={followValue ? "white" : buttonColor}
                                />
                            )}
                            onPress={followOnPress}
                        >
                            {followValue
                                ? "Followed"
                                : "Follow for Notifications"}
                        </Button>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderColor: buttonColor,
                        }}
                    >
                        {updateValue && (
                            <Button
                                style={{
                                    width: "40%",
                                    margin: 4,
                                    borderColor: buttonColor,
                                }}
                                mode="outlined"
                                textColor={buttonColor}
                                icon={() => (
                                    <Ionicons
                                        name="create-outline"
                                        size={20}
                                        color={buttonColor}
                                    />
                                )}
                                onPress={updateOnPress}
                            >
                                Update
                            </Button>
                        )}
                        {locationValue && userRole && userRole.isCaretaker && (
                            // only show location button for caretakers
                            <Button
                                style={{
                                    width: "40%",
                                    margin: 4,
                                    borderColor: buttonColor,
                                }}
                                mode="outlined"
                                textColor={buttonColor}
                                icon={() => (
                                    <Ionicons
                                        name="location-outline"
                                        size={20}
                                        color={buttonColor}
                                    />
                                )}
                                onPress={locationOnPress}
                            >
                                Locate
                            </Button>
                        )}
                    </View>
                    {errorFollow[0] && (
                        <>
                            <ErrorText
                                text={"Error: " + errorFollow[0].message}
                            />
                            <SaladSmudgeCat size={100} />
                        </>
                    )}
                    {loadingFollow[0] && (
                        <ActivityIndicator color={secondaryColor} />
                    )}
                </>
            )}
        </View>
    );
};

// Key Info Container (Gender, Age, Sterilised)
// props: cat (object), variant (string)
const KeyInfoContainer = ({ cat, variant }) => {
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
    );
};

// Details Container
// props: cat (object), userRole (object), ...rest (IconTextField props)
const DetailsContainer = ({ cat, userRole, ...rest }) => {
    // Process concernStatus into a string
    const concernStatusList = [];
    cat.concernStatus.injured && concernStatusList.push("Injured");
    cat.concernStatus.missing && concernStatusList.push("Missing");
    cat.concernStatus.new && concernStatusList.push("New");
    cat.concernStatus.unfed && concernStatusList.push("Unfed");
    const concernStatusString =
        concernStatusList.length === 0
            ? "Healthy"
            : concernStatusList.join(", ");

    // Process concernStatusDesc based on concernStatus
    const processedConcernStatusDesc =
        concernStatusString === "Healthy"
            ? "This cat is happy and healthy!"
            : cat.concernDesc
            ? cat.concernDesc
            : "This cat requires attention!";

    return (
        <View style={styles.detailsContainer}>
            <IconTextField
                iconTextStyle={styles.iconTextStyle}
                {...rest}
                iconName="star-outline"
                field="Key Features"
                info={cat.keyFeatures ? cat.keyFeatures : "Unknown"}
            />
            <Divider />
            <IconTextField
                iconTextStyle={styles.iconTextStyle}
                {...rest}
                iconName="location-outline"
                field="Last Seen"
                info={
                    cat.locationName && cat.lastSeenTime && userRole
                        ? formatLastSeen(
                              userRole.isCaretaker
                                  ? cat.locationName
                                  : cat.locationZone,
                              cat.lastSeenTime
                          )
                        : "Unknown"
                }
            />
            <Divider />
            <IconTextField
                iconTextStyle={styles.iconTextStyle}
                {...rest}
                iconName="time-outline"
                field="Last Fed"
                info={
                    cat.lastFedTime ? formatLastFed(cat.lastFedTime) : "Unknown"
                }
            />
            <Divider />
            <IconTextField
                iconTextStyle={styles.iconTextStyle}
                {...rest}
                iconName="alert-circle-outline"
                field="Concern Status"
                info={concernStatusString}
            />
            <Divider />
            <IconTextField
                iconTextStyle={styles.iconTextStyle}
                {...rest}
                iconName="information-circle-outline"
                field="Concerns"
                info={processedConcernStatusDesc}
            />
        </View>
    );
};

// Render preview photos on profile
// props: photoURLs (array)
const PreviewPhotos = ({ photoURLs }) => {
    let previewPhotos;

    if (photoURLs === null) {
        return (
            <View style={styles.previewContainer}>
                <Text
                    variant="BodyMedium"
                    style={[
                        allStyles.bodyText,
                        {
                            marginTop: 20,
                        },
                    ]}
                >
                    This cat has no photos!
                </Text>
            </View>
        );
    } else if (photoURLs.length > 4) {
        previewPhotos = photoURLs.slice(0, 4);
    } else {
        previewPhotos = photoURLs;
    }

    const imageSize = getItemWidthCols(4, 8);

    return (
        <View style={styles.previewContainer}>
            {previewPhotos.map((photoURL, index) => {
                return (
                    <View key={index} testID="preview-photo">
                        <Image
                            style={{
                                height: imageSize,
                                width: imageSize,
                                resizeMode: "cover",
                                margin: 4,
                            }}
                            source={{ uri: photoURL }}
                        />
                    </View>
                );
            })}
        </View>
    );
};

// Photos Container
// props: photoURLs (array), variant (string), iconSize (number), onPress (callback)
const PhotosContainer = ({ photoURLs, variant, iconSize, onPress }) => {
    return (
        <View style={styles.photosContainer}>
            <View style={styles.photosHeader}>
                <TitleText variant={variant} text="Photos" />
                <TouchableOpacity testID="view-button" onPress={onPress}>
                    <View style={{ flexDirection: "row" }}>
                        <BodyText
                            variant={variant}
                            text="View All"
                            color={secondaryColor}
                        />
                        <Ionicons
                            name="chevron-forward"
                            size={iconSize}
                            color={secondaryColor}
                            style={{ marginHorizontal: 4 }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
            <PreviewPhotos photoURLs={photoURLs ? photoURLs : null} />
        </View>
    );
};

export {
    AvatarContainer,
    KeyInfoContainer,
    DetailsContainer,
    PreviewPhotos,
    PhotosContainer,
};

const styles = StyleSheet.create({
    avatarContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: screenMainColor,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 12,
    },
    keyInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: 12,
        backgroundColor: screenMainColor,
    },
    detailsContainer: {
        justifyContent: "space-evenly",
        padding: 15,
        marginVertical: 12,
        backgroundColor: screenMainColor,
    },
    iconTextStyle: {
        marginHorizontal: 8,
        marginVertical: 10,
    },
    photosContainer: {
        padding: 16,
        backgroundColor: screenMainColor,
    },
    photosHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 8,
    },
    previewContainer: {
        flexDirection: "row",
        paddingTop: 4,
    },
});
