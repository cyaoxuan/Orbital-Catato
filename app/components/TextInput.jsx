import { View, StyleSheet } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';

const AuthInput = (props) => {
    const [value, setValue] = useState("");

    return (
        <View style={styles.inputContainer}>
            <Ionicons testID="icon" 
                name={props.iconName || "help"} 
                size={24} 
                style={styles.icon} />
            <TextInput testID="input"
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

const PasswordInput = (props) => {
    const [value, setValue] = useState("");
    const [secureText, setSecureText] = useState(true);
    const changeHide = () => setSecureText((prev) => !prev);

    return (
        <View style={styles.inputContainer}>
            <Ionicons testID="icon"
                name={props.iconName || "help"} 
                size={24} 
                style={styles.icon} />
            <TextInput testID="input" 
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
                    <TextInput.Icon testID="hide-icon"
                        icon={secureText ? "eye" : "eye-off"}
                        onPress={changeHide}
                        forceTextInputFocus={false}
                    />
                }
            />    
        </View>
    );
};

// Required Input, need to pass in a 'value' prop for the error message to work correctly
const FormInput = (props) => {
    const [value, setValue] = useState("");

    return (
        <View style={{ width: "90%", height:100}}>
            <TextInput style={styles.formInput}
                disabled={props.disabled}
                multiline={props.multiline}
                label={props.label || "Label"}
                placeholder={props.placeholder}
            
                value={props.value || value}
                onChangeText={props.onChangeText || setValue}

                error={!props.value || !value}
            />
            <HelperText type="error" padding="none" visible={!props.value || !value}>
                Error: {props.errorText}
            </HelperText>
        </View>
    );
};

export { AuthInput, PasswordInput, FormInput };

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row", 
        alignItems: "center",
        justifyContent: "center",
        padding: 12
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
        alignContent: "center"
    },

    icon: {
        marginHorizontal: 8
    }
  });
