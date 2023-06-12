import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-paper";

const CatAvatar = (props) => {
    return (
        <View style={styles.avatarContainer}>
            <Avatar.Image
                source={props.photoURL}
                size={props.size}
                testID="avatar-image"
            />
            <Text variant={props.variant}>{props.name}</Text>
        </View>
    );
};

const TouchableCatAvatar = (props) => {
    return (
            <TouchableOpacity style={styles.avatarContainer}
                activeOpacity={0.7}
                onPress={props.onPress}>
                <Avatar.Image
                    source={props.photoURL}
                    size={props.size}
                    testID="avatar-image"
                />
                <Text variant={props.variant}>{props.name}</Text>
            </TouchableOpacity>
    );
};

export { CatAvatar, TouchableCatAvatar }

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: "center"
    }
})