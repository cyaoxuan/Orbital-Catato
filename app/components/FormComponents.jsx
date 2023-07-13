import { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
    Button,
    HelperText,
    Menu,
    RadioButton,
    TextInput,
} from "react-native-paper";
import { SelectList } from "react-native-dropdown-select-list";
import NumericInput from "react-native-numeric-input";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { timeOptions } from "../data/DateTimeOptions";
import { BodyText, ErrorText, RequiredFormText } from "./Text";
import { allStyles, screenSecondaryColor, secondaryColor } from "./Styles";
import Ionicons from "@expo/vector-icons/Ionicons";

// Styled dropdown select list from react-native-dropdown select list
// Required field, shows errorText if nothing is selected
// props: titleText (string), selected (hook value), setSelected (hook function),
// data (array of objects with key:value properties)
const DropdownList = (props) => {
    const [selected, setSelected] = useState("");

    return (
        <View style={styles.container}>
            <RequiredFormText variant={titleVariant} text={props.titleText} />
            <SelectList
                fontFamily="Nunito-Medium"
                setSelected={
                    props.setSelected
                        ? props.setSelected
                        : (val) => setSelected(val)
                }
                data={props.data || [{ key: "1", value: "value" }]}
                save="value"
            />
            {selected === "" && props.selected === "" && (
                <ErrorText
                    variant={bodyVariant}
                    text={"Please select an option before continuing!"}
                />
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
                style={[styles.formInput, allStyles.bodyText]}
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
            <RequiredFormText variant={titleVariant} text={props.titleText} />
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
                upDownButtonsBackgroundColor={screenSecondaryColor}
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
            <RequiredFormText variant={titleVariant} text={props.titleText} />
            <Button
                onPress={props.onPress}
                style={{
                    width: "50%",
                    margin: 4,
                    borderColor: secondaryColor,
                }}
                buttonColor={secondaryColor}
                textColor="white"
            >
                Pick Time{" "}
            </Button>
            <BodyText
                variant={bodyVariant}
                text={
                    "Selected Time: " +
                    props.displayTime.toLocaleTimeString("en-GB", timeOptions) +
                    " (SGT, GMT+8)"
                }
            />
            {props.displayTime > props.today && (
                <ErrorText
                    variant={bodyVariant}
                    text="Error: Selected future time! Are you a time traveller?"
                />
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
            <BodyText
                variant="bodySmall"
                text="*Selected Time may be different if your device is not in SGT!"
            />
        </View>
    );
};

// Styled Radio input from RN Paper, for two radio buttons only
// For gender, sterilised, concerns in forms
// props: titleText (string), firstText (string), firstValue (string), secondText (string), secondValue (string),
// value (hook value), onValueChange (callback)
const TwoRadioInput = (props) => {
    const [selected, setSelected] = useState("First");
    const radioColor = secondaryColor;

    return (
        <View style={styles.container}>
            <RequiredFormText variant={titleVariant} text={props.titleText} />
            <RadioButton.Group
                value={props.value ? props.value : selected}
                onValueChange={
                    props.onValueChange
                        ? props.onValueChange
                        : (value) => setSelected(value)
                }
            >
                <View style={styles.radioButtonContainer}>
                    <BodyText
                        variant={bodyVariant}
                        text={props.firstValue || "First"}
                    />
                    <RadioButton.Android
                        value={props.firstValue || "First"}
                        color={radioColor}
                    />
                </View>
                <View style={styles.radioButtonContainer}>
                    <BodyText
                        variant={bodyVariant}
                        text={props.secondValue || "Second"}
                    />
                    <RadioButton.Android
                        value={props.secondValue || "Second"}
                        color={radioColor}
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
    const radioColor = secondaryColor;

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
                <BodyText
                    variant={bodyVariant}
                    text={props.firstValue || "First"}
                />
                <RadioButton.Android
                    value={props.firstValue || "First"}
                    disabled={props.disabled}
                    color={radioColor}
                />
            </View>
            <View style={styles.radioButtonContainer}>
                <BodyText
                    variant={bodyVariant}
                    text={props.secondValue || "Second"}
                />
                <RadioButton.Android
                    value={props.secondValue || "Second"}
                    disabled={props.disabled}
                    color={radioColor}
                />
            </View>
            <View style={styles.radioButtonContainer}>
                <BodyText
                    variant={bodyVariant}
                    text={props.thirdValue || "Third"}
                />
                <RadioButton.Android
                    value={props.thirdValue || "Third"}
                    disabled={props.disabled}
                    color={radioColor}
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
            {props.showError ? (
                <RequiredFormText
                    variant={titleVariant}
                    text={props.titleText}
                />
            ) : (
                <BodyText variant={titleVariant} text={props.titleText} />
            )}
            <View>
                <Menu
                    style={{ marginTop: -50, marginLeft: 10 }}
                    theme={{
                        colors: { elevation: { level2: screenSecondaryColor } },
                    }}
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <Button
                            style={{
                                width: "50%",
                                margin: 4,
                                borderColor: secondaryColor,
                            }}
                            buttonColor={secondaryColor}
                            textColor="white"
                            icon={() => (
                                <Ionicons
                                    name="camera"
                                    size={20}
                                    color="white"
                                />
                            )}
                            onPress={openMenu}
                        >
                            Upload
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
            <BodyText
                variant={bodyVariant}
                text={"Image: " + (props.photoURI ? props.photoURI : "")}
            />

            {props.showError && !props.photoURI && (
                <ErrorText
                    variant={bodyVariant}
                    text="Upload before continuing!"
                />
            )}
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
        width: "85%",
        marginVertical: 8,
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
