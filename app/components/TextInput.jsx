import { View, StyleSheet } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';

const AuthInput = (props) => {
    return (
        <View style={styles.inputContainer}>
            <Ionicons name={props.iconName} size={24} style={ styles.icon } />
            <TextInput style={styles.input}
                    mode="outlined"
                    disabled={props.disabled}
                    label={props.label}
                    placeholder={props.placeholder}

                    autoCapitalize="none"
                    textContentType={props.textContentType}

                    value={props.value}
                    onChangeText={props.onChangeText}
                  />
        </View>
    );
};

const PasswordInput = (props) => {
    const [secureText, setSecureText] = useState(true);

    return (
        <View style={styles.inputContainer}>
            <Ionicons name={props.iconName} size={24} style={styles.icon} />
            <TextInput style={styles.input}
                mode="outlined"
                disabled={props.disabled}
                label={props.label}
                placeholder={props.placeholder}

                autoCorrect={false}
                autoCapitalize="none"

                textContentType={props.textContentType}
                value={props.value}
                onChangeText={props.onChangeText}

                secureTextEntry={secureText}
                right={
                    <TextInput.Icon
                        icon={secureText ? "eye" : "eye-off"}
                        onPress={() =>
                            setSecureText((prev) => !prev)
                        }
                        forceTextInputFocus={false}
                    />
                }
            />    
        </View>
    );
};

// Required Input, need to pass in a 'value' prop for the error message to work correctly
const FormInput = (props) => {
    return (
        <View style={{ width: "90%", height:100}}>
            <TextInput style={styles.formInput}
                disabled={props.disabled}
                multiline={props.multiline}
                label={props.label}
                placeholder={props.placeholder}
            
                value={props.value}
                onChangeText={props.onChangeText}

                error={!props.value}
            />
            <HelperText type="error" padding="none" visible={!props.value}>
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
        justifyContent: "center"
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
