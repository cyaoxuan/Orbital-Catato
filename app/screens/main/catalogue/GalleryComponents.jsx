import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Dialog, FAB, IconButton, Text } from "react-native-paper";
import { BodyText, ErrorText } from "../../../components/Text";
import {
    allStyles,
    screenMainColor,
    screenSecondaryColor,
    secondaryColor,
} from "../../../components/Styles";

// Image item in PhotoGallery FlatList
// props: item (object), index (number), deleting (boolean), imageOnPress (callback), imageSize (number), imageMargins (number)
const ImageItem = ({
    item,
    index,
    deleting,
    imageOnPress,
    imageSize,
    imageMargins,
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={!deleting}
            onPress={imageOnPress}
            style={{
                height: imageSize + 30 + imageMargins,
                width: imageSize + imageMargins,
                flex: 0.5,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <View key={index} testID="gallery-photo">
                <Image
                    style={{
                        height: imageSize,
                        width: imageSize,
                        resizeMode: "cover",
                        marginHorizontal: imageMargins,
                    }}
                    source={{ uri: item.photoURL }}
                />

                {deleting && (
                    <View
                        style={{
                            flexDirection: "row",
                            height: 30,
                            marginHorizontal: imageMargins,
                            justifyContent: "space-between",
                        }}
                    >
                        <BodyText
                            text={item.isSelected ? "Selected" : "Not Selected"}
                        />

                        <Ionicons
                            name={
                                item.isSelected
                                    ? "checkmark-circle"
                                    : "checkmark-circle-outline"
                            }
                            size={20}
                            color={secondaryColor}
                        />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

// Image FAB in the gallery
// props: open (hook value), setOpen (hook setState), filterValue (hook value),
// handleAddImageFrom (callback), changeDeleting (callback)
const ImageFAB = ({
    open,
    setOpen,
    handleAddImageFrom,
    changeDeleting,
    filterValue,
}) => {
    const deleteButton = {
        icon: () => (
            <Ionicons
                name="trash"
                size={20}
                color={secondaryColor}
                style={{ alignSelf: "center" }}
            />
        ),
        label: "Delete",
        onPress: changeDeleting,
    };

    // Action buttons
    const actions =
        filterValue === "Concern"
            ? [deleteButton]
            : [
                  {
                      icon: () => (
                          <Ionicons
                              name="camera"
                              size={20}
                              color={secondaryColor}
                              style={{ alignSelf: "center" }}
                          />
                      ),
                      label: "Camera",
                      onPress: () => handleAddImageFrom("Camera"),
                  },
                  {
                      icon: () => (
                          <Ionicons
                              name="image"
                              size={20}
                              color={secondaryColor}
                              style={{ alignSelf: "center" }}
                          />
                      ),
                      label: "Gallery",
                      onPress: () => handleAddImageFrom("Gallery"),
                  },
                  deleteButton,
              ];

    return (
        <FAB.Group
            testID="fab-group"
            style={{
                position: "absolute",
                bottom: 10,
                right: 10,
            }}
            fabStyle={{ backgroundColor: secondaryColor }}
            theme={{ colors: { elevation: { level3: screenSecondaryColor } } }}
            color="white"
            open={open}
            icon={"pencil"}
            actions={actions}
            onStateChange={() => setOpen((prev) => !prev)}
        />
    );
};

// Image Dialog in Gallery
// props: visible (boolean), deleting (boolean), dialogText (string), filterValue (hook value),
// handleDeletImages (callback), backHideDialog (callback), confirmHideDialog (callback)
const ImageDialog = ({
    visible,
    deleting,
    dialogText,
    filterValue,
    handleDeleteImages,
    backHideDialog,
    confirmHideDialog,
}) => {
    return (
        <Dialog
            visible={visible}
            onDismiss={backHideDialog}
            theme={{
                colors: {
                    elevation: { level3: screenMainColor },
                },
            }}
        >
            <Dialog.Title>
                {deleting || dialogText.includes("Delete")
                    ? "Image Deletion"
                    : "Image Upload"}
            </Dialog.Title>
            <Dialog.Content>
                <BodyText variant="bodyMedium" text={dialogText} />
            </Dialog.Content>
            <Dialog.Actions>
                {deleting && (
                    <>
                        <Button
                            onPress={() => handleDeleteImages(filterValue)}
                            textColor={secondaryColor}
                            labelStyle={allStyles.buttonText}
                        >
                            Confirm Delete
                        </Button>
                        <Button
                            onPress={backHideDialog}
                            textColor={secondaryColor}
                            labelStyle={allStyles.buttonText}
                        >
                            Back
                        </Button>
                    </>
                )}
                {!deleting && (
                    <Button
                        onPress={
                            dialogText.includes("Error")
                                ? backHideDialog
                                : confirmHideDialog
                        }
                        mode="text"
                        textColor={secondaryColor}
                        labelStyle={allStyles.buttonText}
                    >
                        Done
                    </Button>
                )}
            </Dialog.Actions>
        </Dialog>
    );
};

// Deleting bar in photoGallery that appears when deleting
// props: changeDeleting (callback), selectedImages (hook value array),
// photoURLs (array), filterValue (hook value), showDeleteDialog (boolean)
const DeletingView = ({
    changeDeleting,
    selectedImages,
    photoURLs,
    filterValue,
    showDeleteDialog,
}) => {
    const isAllSelected =
        selectedImages.length === photoURLs.length && filterValue === "Gallery";

    return (
        <View
            style={{
                height: 50,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: screenSecondaryColor,
            }}
        >
            <IconButton
                icon={() => (
                    <Ionicons
                        name="close-circle-outline"
                        size={20}
                        color={secondaryColor}
                        style={{ alignSelf: "center" }}
                    />
                )}
                onPress={changeDeleting}
            />
            <Text style={allStyles.bodyText}>
                Selected Items: {selectedImages.length}
                {isAllSelected && <ErrorText text={" (Cannot Delete All)"} />}
            </Text>
            <Button
                mode="text"
                textColor={secondaryColor}
                onPress={showDeleteDialog}
                disabled={
                    // gallery cannot delete all photos
                    selectedImages.length === 0 || isAllSelected
                }
            >
                Delete
            </Button>
        </View>
    );
};

export { DeletingView, ImageDialog, ImageFAB, ImageItem };
