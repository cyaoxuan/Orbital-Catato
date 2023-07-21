import { View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { allStyles, primaryColor, secondaryColor } from "./Styles";

// Text Input for authentication screens (email / username) and admin panel
// props: iconName (string), disabled (boolean), label (string), placeholder (string), textContentType (string)
// value (hook value), onChangeText (callback), colorMode (string)
const AuthInput = (props) => {
    const [value, setValue] = useState("");

    return (
        <View style={styles.inputContainer}>
            <Ionicons
                testID="icon"
                name={props.iconName || "help"}
                size={20}
                style={styles.icon}
            />
            <TextInput
                testID="auth-input"
                style={[styles.input, allStyles.bodyText]}
                activeUnderlineColor={
                    props.colorMode === "secondary"
                        ? secondaryColor
                        : primaryColor
                }
                mode="flat"
                disabled={props.disabled}
                label={props.label || "Label"}
                autoCapitalize="none"
                textContentType={props.textContentType}
                value={props.value || value}
                onChangeText={props.onChangeText || setValue}
            />
        </View>
    );
};

// Text input for passwords in auth screens, hides content
// props: iconName (string), label (stirng), placeholder (string), textContentType (string),
// disabled (boolean), value (hook value), onChangeText (callback)
const PasswordInput = (props) => {
    const [value, setValue] = useState("");
    const [secureText, setSecureText] = useState(true);
    const changeHide = () => setSecureText((prev) => !prev);

    return (
        <View style={styles.inputContainer}>
            <Ionicons
                testID="icon"
                name={props.iconName || "help"}
                size={20}
                style={styles.icon}
            />
            <TextInput
                testID="password-input"
                style={[styles.input, allStyles.bodyText]}
                activeUnderlineColor={primaryColor}
                mode="flat"
                disabled={props.disabled}
                label={props.label || "Label"}
                autoCorrect={false}
                autoCapitalize="none"
                textContentType={props.textContentType}
                value={props.value || value}
                onChangeText={props.onChangeText || setValue}
                secureTextEntry={secureText}
                right={
                    <TextInput.Icon
                        testID="hide-icon"
                        icon={secureText ? "eye" : "eye-off"}
                        onPress={changeHide}
                        forceTextInputFocus={false}
                    />
                }
            />
        </View>
    );
};

export { AuthInput, PasswordInput };

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        justifyContent: "center",
        padding: 12,
    },

    input: {
        fontSize: 16,
        width: "90%",
        backgroundColor: "transparent",
    },

    icon: {
        marginHorizontal: 16,
        marginTop: 28,
    },
});
