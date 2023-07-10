import { View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

// Text Input for authentication screens (email / username) and admin panel
// props: iconName (string), disabled (boolean), label (string), placeholder (string), textContentType (string)
// value (hook value), onChangeText (callback)
const AuthInput = (props) => {
    const [value, setValue] = useState("");

    return (
        <View style={styles.inputContainer}>
            <Ionicons
                testID="icon"
                name={props.iconName || "help"}
                size={24}
                style={styles.icon}
            />
            <TextInput
                testID="input"
                style={styles.input}
                mode="outlined"
                disabled={props.disabled}
                label={props.label || "Label"}
                placeholder={props.placeholder}
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
                size={24}
                style={styles.icon}
            />
            <TextInput
                testID="input"
                style={styles.input}
                mode="outlined"
                disabled={props.disabled}
                label={props.label || "Label"}
                placeholder={props.placeholder}
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
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
    },

    input: {
        fontSize: 16,
        width: "80%",
    },

    formInput: {
        fontSize: 16,
        width: "100%",
        backgroundColor: "transparent",
        paddingHorizontal: 0,
        alignContent: "center",
    },

    icon: {
        marginHorizontal: 8,
    },
});
