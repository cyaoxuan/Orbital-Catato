import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { screenSecondaryColor } from "./Styles";

// Displays Field: Info with icons
// props: iconTextStyle (style), iconName (string), iconSize (number),
// variant (string), field (string), info (string)
const IconTextField = (props) => {
    return (
        <View style={props.iconTextStyle}>
            <View style={styles.iconTextContainer}>
                <Ionicons
                    testID="icon"
                    style={{ marginHorizontal: 4 }}
                    name={props.iconName || "help"}
                    size={props.iconSize || 24}
                />
                <Text style={styles.field} variant={props.variant}>
                    {props.field || "Field: "}
                </Text>
            </View>
            <View style={{ paddingLeft: 24 }}>
                <Text style={styles.info} variant={props.variant}>
                    {props.info || "Info"}
                </Text>
            </View>
        </View>
    );
};

// Displays Field: Info with icons
// props: iconTextStyle (style), iconName (string), iconSize (number),
// variant (string), field (string), info (string)
const IconTextFieldRow = (props) => {
    return (
        <View style={[styles.iconTextContainer, props.iconTextStyle]}>
            <Ionicons
                testID="icon"
                style={{ marginHorizontal: 4 }}
                name={props.iconName || "help"}
                size={props.iconSize || 24}
            />
            <Text style={styles.field} variant={props.variant}>
                {props.field || "Field: "}
                <Text style={styles.info} variant={props.variant}>
                    {props.info || "Info"}
                </Text>
            </Text>
        </View>
    );
};

// Displays Field: Info
// props: field (string), info (string)
const KeyTextField = (props) => {
    return (
        <View style={styles.keyTextContainer}>
            <Text style={styles.info} variant="bodyMedium">
                {props.field || "Field"}
            </Text>
            <Text style={styles.field} variant="bodyLarge">
                {props.info || "Info"}
            </Text>
        </View>
    );
};

export { IconTextField, IconTextFieldRow, KeyTextField };

const styles = StyleSheet.create({
    iconTextContainer: {
        flexDirection: "row",
    },

    keyTextContainer: {
        alignItems: "center",
        width: 85,
        height: 80,
        padding: 8,
        backgroundColor: screenSecondaryColor,
        borderRadius: 10,
    },

    field: {
        flex: 1,
        fontFamily: "Nunito-Bold",
    },

    info: {
        flex: 1,
        fontFamily: "Nunito-Medium",
    },
});
