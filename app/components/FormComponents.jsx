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

// For Location
const DropdownList = (props) => {
    const [selected, setSelected] = useState("");

    return (
        <View style={styles.container}>
            <Text variant={titleVariant}>{props.titleText}</Text>
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

// Text inputs, description reasons, name, features etc
// Required field
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

// For year
const NumberSpinner = (props) => {
    const [number, setNumber] = useState(new Date().getFullYear());

    return (
        <View style={styles.container}>
            <Text variant={titleVariant}>{props.titleText}</Text>
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

// For time
const TimeInput = (props) => {
    return (
        <View style={styles.container}>
            <Text variant={titleVariant}>{props.titleText}</Text>
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
                *Time Picker uses device local time, which may cause
                discrepancies with selected time
            </Text>
        </View>
    );
};

// For gender, sterilised, concerns, foster
const TwoRadioInput = (props) => {
    const [selected, setSelected] = useState("First");

    return (
        <View style={styles.container}>
            <Text variant={titleVariant}>{props.titleText}</Text>
            <RadioButton.Group
                value={props.value ? props.value : selected}
                onValueChange={
                    props.onValueChange
                        ? props.onValueChange
                        : (value) => setSelected(value)
                }
            >
                <View style={styles.radioButtonContainer}>
                    <Text variant={bodyVariant}>{props.firstText}</Text>
                    <RadioButton.Android value={props.firstValue || "First"} />
                </View>
                <View style={styles.radioButtonContainer}>
                    <Text variant={bodyVariant}>{props.secondText}</Text>
                    <RadioButton.Android
                        value={props.secondValue || "Second"}
                    />
                </View>
            </RadioButton.Group>
        </View>
    );
};

// To upload photos in form
const UploadPhotos = (props) => {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <View style={styles.container}>
            <Text variant={titleVariant}>Upload Photos:</Text>
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
