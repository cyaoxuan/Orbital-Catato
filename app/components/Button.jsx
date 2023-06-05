import { View } from "react-native";
import { Button } from "react-native-paper";

const PillButton = (props) => {
    return (
        <View style={{ flexDirection: "row" }}>
                <Button style = {{ margin: 10, width: props.width }}
                    disabled={props.disabled}
                    mode={props.mode}
                    onPress={props.onPress}>
                        {props.label}
                </Button>
        </View>
    )
}

export { PillButton };