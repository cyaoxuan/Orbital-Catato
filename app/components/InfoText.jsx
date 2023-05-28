import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

const IconTextField = (props) => {
    return (
        <View style={[styles.iconTextContainer, props.iconTextStyle]}>
            <Ionicons name={props.iconName} size={props.iconSize} style={{ marginHorizontal: 4 }} />
            <Text style={styles.field} variant={props.variant}>
                {props.field}
                <Text variant={props.variant}>{props.info}</Text>
                </Text>
        </View>
    );
};

const KeyTextField = (props) => {
    return (
        <View style={styles.keyTextContainer}>
            <Text style={styles.field} variant={props.variant}>{props.field}</Text>
            <Text variant={props.variant}>{props.info}</Text>
        </View>
    );
};

export { IconTextField, KeyTextField };

const styles = StyleSheet.create({
    iconTextContainer: {
        flexDirection: "row", 
    },

    keyTextContainer: {
        justifyContent: "center" 
    },
    
    field: {
        fontWeight: "bold"
    }
})