import { useState } from "react";
import { View } from "react-native";
import { Button, SegmentedButtons } from "react-native-paper";
import { allStyles, primaryColor, secondaryColor } from "./Styles";

// PillButton component, styled RN Paper button
// props: width (string %), disabled (boolean), onPress (callback), label (string), colorMode (string)
const PillButton = (props) => {
    return (
        <View style={{ width: "100%", alignItems: "center", margin: 10 }}>
            <Button
                style={{
                    height: 40,
                    width: props.width || "90%",
                    borderRadius: 50,
                    justifyContent: "center",
                }}
                labelStyle={allStyles.buttonText}
                disabled={props.disabled}
                buttonColor={
                    props.colorMode === "primary"
                        ? primaryColor
                        : secondaryColor
                }
                textColor={"white"}
                onPress={props.onPress}
            >
                {props.label || "Button"}
            </Button>
        </View>
    );
};

// TextButton component, styled RN Paper button
// props: width (string %), disabled (boolean), onPress (callback), label (string)
const TextButton = (props) => {
    return (
        <View style={{ flexDirection: "row" }}>
            <Button
                style={{ margin: 10, height: 40, width: props.width || "90%" }}
                labelStyle={allStyles.buttonText}
                disabled={props.disabled}
                mode="text"
                textColor={primaryColor}
                onPress={props.onPress}
            >
                {props.label || "Button"}
            </Button>
        </View>
    );
};

// Styled RN Paper SegmentedButton
// props: filterValue (hook value). onValueChange (callback), disabled (boolean), firstValue (string), secondValue (string)
const FilterButton = (props) => {
    const [filterValue, setFilterValue] = useState("First");

    return (
        <SegmentedButtons
            style={{ width: "80%", margin: 8 }}
            theme={{
                colors: {
                    secondaryContainer: secondaryColor,
                    onSurface: secondaryColor,
                    outline: secondaryColor,
                },
            }}
            value={props.filterValue ? props.filterValue : filterValue}
            onValueChange={
                props.onValueChange
                    ? props.onValueChange
                    : (value) => setFilterValue(value)
            }
            buttons={[
                {
                    value: props.firstValue ? props.firstValue : "First",
                    label: props.firstValue ? props.firstValue : "First",
                    disabled: props.disabled,
                    uncheckedColor: secondaryColor,
                    checkedColor: "white",
                },
                {
                    value: props.secondValue ? props.secondValue : "Second",
                    label: props.secondValue ? props.secondValue : "Second",
                    disabled: props.disabled,
                    uncheckedColor: secondaryColor,
                    checkedColor: "white",
                },
            ]}
        />
    );
};

export { FilterButton, PillButton, TextButton };
