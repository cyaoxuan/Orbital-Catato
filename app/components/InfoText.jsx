import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

const IconTextField = (props) => {
    return (
        <View style={[styles.iconTextContainer, props.iconTextStyle]}>
            <Ionicons testID="icon" 
                style={{ marginHorizontal: 4 }} 
                name={props.iconName || "help"} 
                size={props.iconSize || 24}  />
            <Text style={styles.field} variant={props.variant}>
                {props.field || "Field: "}
                <Text style={styles.info} variant={props.variant}>{props.info || "Info"}</Text>
                </Text>
        </View>
    );
};

const KeyTextField = (props) => {
    return (
        <View style={styles.keyTextContainer}>
            <Text style={{ fontWeight: "bold" }} variant={props.variant}>{props.field || "Field"}</Text>
            <Text variant={props.variant}>{props.info || "Info"}</Text>
        </View>
    );
};

export { IconTextField, KeyTextField };

const styles = StyleSheet.create({
    iconTextContainer: {
        flexDirection: "row"
    },

    keyTextContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    
    field: {
        flex: 1,
        fontWeight: "bold"
    },

    info: {
        flex: 1
    }
})