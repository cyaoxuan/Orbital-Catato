import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";
import { BodyText, TitleText } from "./Text";

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
            <BodyText variant={props.variant} text={props.name || "Name"} />
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
            <BodyText variant={props.variant} text={props.name || "Name"} />
        </TouchableOpacity>
    );
};

export { CatAvatar, TouchableCatAvatar };

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: "center",
    },
});
