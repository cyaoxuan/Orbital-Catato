import { View } from "react-native";
import { Button } from "react-native-paper";

const PillButton = (props) => {
    return (
        <View style={{ flexDirection: "row" }}>
                <Button style = {{ margin: 10, width: props.width || "60%"}}
                    disabled={props.disabled}
                    mode={props.mode || "outlined"}
                    onPress={props.onPress}>
                        {props.label || "Button"}
                </Button>
        </View>
    )
}

export { PillButton };