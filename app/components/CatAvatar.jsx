import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-paper";

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
