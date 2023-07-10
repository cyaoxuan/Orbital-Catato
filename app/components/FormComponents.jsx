import { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
    Button,
    HelperText,
    Menu,
    RadioButton,
    Text,
    TextInput,
} from "react-native-paper";
import { SelectList } from "react-native-dropdown-select-list";
import NumericInput from "react-native-numeric-input";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { timeOptions } from "../data/DateTimeOptions";

// Styled dropdown select list from react-native-dropdown select list
// Required field, shows errorText if nothing is selected
// props: titleText (string), selected (hook value), setSelected (hook function),
// data (array of objects with key:value properties)
const DropdownList = (props) => {
    const [selected, setSelected] = useState("");

    return (
        <View style={styles.container}>
            <Text variant={titleVariant} style={styles.errorText}>
                *<Text variant={titleVariant}>{props.titleText}</Text>
            </Text>
            <SelectList
                setSelected={
                    props.setSelected
                        ? props.setSelected
                        : (val) => setSelected(val)
                }
                data={props.data || [{ key: "1", value: "value" }]}
                save="value"
            />
            {selected === "" && props.selected === "" && (
                <Text variant={bodyVariant} style={styles.errorText}>
                    Please select an option before continuing!
                </Text>
            )}
        </View>
    );
};

// Text inputs for form description, reasons, name, features fields etc
// Styled RN Paper Text Input
// Required field, shows HelperText error if nothing has been typed
// props: disabled (boolean), multiline (boolean), label (string), placeholder (string)
// value (hook value), onChangeText (callback), errorText (string)
const FormInput = (props) => {
    const [value, setValue] = useState("");

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.formInput}
                disabled={props.disabled}
                multiline={props.multiline}
                label={props.label || "Label"}
                placeholder={props.placeholder}
                value={props.value ? props.value : value}
                onChangeText={
                    props.onChangeText ? props.onChangeText : setValue
                }
                error={props.value ? !props.value.trim() : !value.trim()}
            />
            <HelperText
                type="error"
                padding="none"
                visible={props.value ? !props.value.trim() : !value.trim()}
            >
                Error: {props.errorText || "Error"}
            </HelperText>
        </View>
    );
};

// Style react-native-numeric-input component to select numbers
// Used for picking year in form
// props: errorText (string), titleText (string), min (number), max (number),
// value (hook value), onChange (callback)
const NumberSpinner = (props) => {
    const [number, setNumber] = useState(new Date().getFullYear());

    return (
        <View style={styles.container}>
            <Text variant={titleVariant} style={styles.errorText}>
                *<Text variant={titleVariant}>{props.titleText}</Text>
            </Text>
            <NumericInput
                type="up-down"
                rounded
                editable={false}
                minValue={props.min}
                maxValue={props.max}
                value={props.value ? props.value : number}
                onChange={
                    props.onChange
                        ? props.onChange
                        : (num) => {
                              setNumber(num);
                          }
                }
                totalWidth={120}
                totalHeight={40}
            />
        </View>
    );
};

// Styled RN dateTimePicker
// Only selects time
// props: titleText (string), displayTime (Date object), today (Date object) onPress (callback), show (boolean)
// value (hook value), onChange (callback)
const TimeInput = (props) => {
    return (
        <View style={styles.container}>
            <Text variant={titleVariant} style={styles.errorText}>
                *<Text variant={titleVariant}>{props.titleText}</Text>
            </Text>
            <Button
                mode="contained-tonal"
                onPress={props.onPress}
                style={{ width: "50%", margin: 4 }}
            >
                Pick Time{" "}
            </Button>
            <Text variant={bodyVariant}>
                Selected Time:{" "}
                {props.displayTime.toLocaleTimeString("en-GB", timeOptions)}{" "}
                {"(SGT, GMT+8)"}
            </Text>
            {props.displayTime > props.today && (
                <Text variant={bodyVariant} style={styles.errorText}>
                    Error: Selected future time! Are you a time traveller?
                </Text>
            )}
            {props.show && (
                <RNDateTimePicker
                    mode="time"
                    display="spinner"
                    is24Hour={true}
                    value={props.value}
                    onChange={props.onChange}
                />
            )}
            <Text variant={bodyVariant}>
                *Selected Time may be different if your device is not in SGT!
            </Text>
        </View>
    );
};

// Styled Radio input from RN Paper, for two radio buttons only
// For gender, sterilised, concerns in forms
// props: titleText (string), firstText (string), firstValue (string), secondText (string), secondValue (string),
// value (hook value), onValueChange (callback)
const TwoRadioInput = (props) => {
    const [selected, setSelected] = useState("First");

    return (
        <View style={styles.container}>
            <Text variant={titleVariant} style={styles.errorText}>
                *<Text variant={titleVariant}>{props.titleText}</Text>
            </Text>
            <RadioButton.Group
                value={props.value ? props.value : selected}
                onValueChange={
                    props.onValueChange
                        ? props.onValueChange
                        : (value) => setSelected(value)
                }
            >
                <View style={styles.radioButtonContainer}>
                    <Text variant={bodyVariant}>
                        {props.firstValue || "First"}
                    </Text>
                    <RadioButton.Android value={props.firstValue || "First"} />
                </View>
                <View style={styles.radioButtonContainer}>
                    <Text variant={bodyVariant}>
                        {props.secondValue || "Second"}
                    </Text>
                    <RadioButton.Android
                        value={props.secondValue || "Second"}
                    />
                </View>
            </RadioButton.Group>
        </View>
    );
};

// Styled Radio input from RN Paper, for three radio buttons only
// For admin panel
// props: disabled (boolean), value (hook value), onValueChange (callback),
// firstValue (string), secondValue (string), thirdValue (string)
const ThreeRadioInput = (props) => {
    const [selected, setSelected] = useState("First");

    return (
        <RadioButton.Group
            value={props.value ? props.value : selected}
            onValueChange={
                props.onValueChange
                    ? props.onValueChange
                    : (value) => setSelected(value)
            }
        >
            <View style={styles.radioButtonContainer}>
                <Text variant={bodyVariant}>{props.firstValue || "First"}</Text>
                <RadioButton.Android
                    value={props.firstValue || "First"}
                    disabled={props.disabled}
                />
            </View>
            <View style={styles.radioButtonContainer}>
                <Text variant={bodyVariant}>
                    {props.secondValue || "Second"}
                </Text>
                <RadioButton.Android
                    value={props.secondValue || "Second"}
                    disabled={props.disabled}
                />
            </View>
            <View style={styles.radioButtonContainer}>
                <Text variant={bodyVariant}>{props.thirdValue || "Third"}</Text>
                <RadioButton.Android
                    value={props.thirdValue || "Third"}
                    disabled={props.disabled}
                />
            </View>
        </RadioButton.Group>
    );
};

// Styled button and menu from RN Paper
// Shows options to upload photo from gallery or camera
// Required field, shows error whe no photoURI is set
// props: titleText (string), showError (boolean), photoURI (string),
// cameraOnPress (callback), galleryOnPress (callback)
const UploadPhotos = (props) => {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <View style={styles.container}>
            <Text variant={titleVariant} style={styles.errorText}>
                {props.showError ? "*" : ""}
                <Text variant={titleVariant}>{props.titleText}</Text>
            </Text>
            <View>
                <Menu
                    style={{ marginTop: -50 }}
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <Button
                            mode="contained-tonal"
                            icon="camera"
                            onPress={openMenu}
                            style={{ width: "50%", margin: 4 }}
                        >
                            Upload{" "}
                        </Button>
                    }
                >
                    <Menu.Item
                        leadingIcon="camera"
                        onPress={props.cameraOnPress}
                        title="Camera"
                    />
                    <Menu.Item
                        leadingIcon="image"
                        onPress={props.galleryOnPress}
                        title="Gallery"
                    />
                </Menu>
            </View>
            <Text variant={bodyVariant}>
                Image: {props.photoURI ? props.photoURI : ""}
                {props.showError && !props.photoURI && (
                    <Text variant={bodyVariant} style={styles.errorText}>
                        Upload before continuing!
                    </Text>
                )}
            </Text>
        </View>
    );
};

export {
    DropdownList,
    FormInput,
    NumberSpinner,
    TimeInput,
    TwoRadioInput,
    ThreeRadioInput,
    UploadPhotos,
};

const titleVariant = "titleMedium";
const bodyVariant = "bodyMedium";

const styles = StyleSheet.create({
    errorText: {
        color: "#BA1A1A",
    },
    formInput: {
        fontSize: 16,
        width: "100%",
        backgroundColor: "transparent",
        paddingHorizontal: 0,
        alignContent: "center",
    },

    container: {
        width: "90%",
        margin: 4,
    },

    radioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 4,
    },

    icon: {
        marginHorizontal: 8,
    },
});
