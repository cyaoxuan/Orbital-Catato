import { useState } from "react";
import { View } from "react-native";
import { Button, SegmentedButtons } from "react-native-paper";

// PillButton component, styled RN Paper button
// props: width (string %), disabled (boolean), mode (string), onPress (callback), label (string)
const PillButton = (props) => {
    return (
        <View style={{ flexDirection: "row" }}>
            <Button
                style={{ margin: 10, width: props.width || "80%" }}
                disabled={props.disabled}
                mode={props.mode || "outlined"}
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
            style={{ width: "70%", margin: 8 }}
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
                },
                {
                    value: props.secondValue ? props.secondValue : "Second",
                    label: props.secondValue ? props.secondValue : "Second",
                    disabled: props.disabled,
                },
            ]}
        />
    );
};

export { FilterButton, PillButton };
