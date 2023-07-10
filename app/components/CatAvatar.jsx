import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-paper";

// Cat Avatar with circular image and name
// props: photoURL (string), size (image size || number), variant (font size || string), name (string)
const CatAvatar = (props) => {
    return (
        <View style={styles.avatarContainer}>
            <Avatar.Image
                testID="avatar-image"
                source={
                    props.photoURL
                        ? { uri: props.photoURL }
                        : require("../../assets/placeholder.png")
                }
                size={props.size || 100}
            />
            <Text variant={props.variant}>{props.name || "Name"}</Text>
        </View>
    );
};

// Cat Avatar with circular image and name, touchable
// props: photoURL (string), size (image size || number), variant (font size || string), name (string), onPress (callback)
const TouchableCatAvatar = (props) => {
    return (
        <TouchableOpacity
            testID="cat-avatar"
            style={styles.avatarContainer}
            activeOpacity={0.7}
            onPress={props.onPress}
        >
            <Avatar.Image
                testID="avatar-image"
                source={
                    props.photoURL
                        ? { uri: props.photoURL }
                        : require("../../assets/placeholder.png")
                }
                size={props.size || 100}
            />
            <Text variant={props.variant}>{props.name || "Name"}</Text>
        </TouchableOpacity>
    );
};

export { CatAvatar, TouchableCatAvatar };

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: "center",
    },
});
