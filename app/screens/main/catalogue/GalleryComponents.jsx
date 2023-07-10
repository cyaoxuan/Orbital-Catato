import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    Button,
    Dialog,
    FAB,
    IconButton,
    Portal,
    Text,
} from "react-native-paper";

// Image item in PhotoGallery FlatList
// props: item (object), index (number), deleting (boolean), imageOnPress (callback), imageSize (number)
const ImageItem = ({ item, index, deleting, imageOnPress, imageSize }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={!deleting}
            onPress={imageOnPress}
            style={{
                height: imageSize + 30 + 8,
                width: imageSize + 8,
            }}
        >
            <View key={index} testID="gallery-photo">
                <Image
                    style={{
                        height: imageSize,
                        width: imageSize,
                        resizeMode: "cover",
                        margin: 8,
                    }}
                    source={{ uri: item.photoURL }}
                />

                {deleting && (
                    <View
                        style={{
                            flexDirection: "row",
                            height: 30,
                            marginHorizontal: 8,
                            justifyContent: "space-between",
                        }}
                    >
                        <Text>
                            {item.isSelected ? "Selected" : "Not Selected"}
                        </Text>
                        <Ionicons
                            name={
                                item.isSelected
                                    ? "checkmark-circle"
                                    : "checkmark-circle-outline"
                            }
                            size={20}
                            color={"#663399"}
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
                color="#663399"
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
                              color="#663399"
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
                              color="#663399"
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
            open={open}
            icon={open ? "close" : "plus"}
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
        <Dialog visible={visible} onDismiss={backHideDialog}>
            <Dialog.Title>
                {deleting || dialogText.includes("Delete")
                    ? "Image Deletion"
                    : "Image Upload"}
            </Dialog.Title>
            <Dialog.Content>
                <Text variant="bodyMedium">{dialogText}</Text>
            </Dialog.Content>
            <Dialog.Actions>
                {deleting && (
                    <>
                        <Button onPress={() => handleDeleteImages(filterValue)}>
                            Confirm Delete
                        </Button>
                        <Button onPress={backHideDialog}>Back</Button>
                    </>
                )}
                {!deleting && (
                    <Button
                        onPress={
                            dialogText.includes("Error")
                                ? backHideDialog
                                : confirmHideDialog
                        }
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
                backgroundColor: "mistyrose",
            }}
        >
            <IconButton
                icon={() => (
                    <Ionicons
                        name="close-circle-outline"
                        size={20}
                        color="#663399"
                        style={{ alignSelf: "center" }}
                    />
                )}
                onPress={changeDeleting}
            />
            <Text>
                Selected Items: {selectedImages.length}
                {isAllSelected && (
                    <Text style={{ color: "#BA1A1A" }}>
                        {" (Cannot Delete All)"}
                    </Text>
                )}
            </Text>
            <Button
                mode="text"
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
