import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-paper";

const CatAvatar = (props) => {
    return (
        <View style={styles.avatarContainer}>
            <Avatar.Image
                source={props.image}
                size={props.size}
            />
            <Text variant={props.variant}>{props.text}</Text>
        </View>
    );
};

const TouchableCatAvatar = (props) => {
    return (
        <TouchableOpacity style={styles.avatarContainer}
            activeOpacity={0.7}>
            <Avatar.Image
                source={props.image}
                size={props.size}
            />
            <Text variant={props.variant}>{props.text}</Text>
        </TouchableOpacity>
    );
};

export { CatAvatar, TouchableCatAvatar }

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: "center"
    }
})