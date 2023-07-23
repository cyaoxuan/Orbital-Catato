import { Text } from "react-native-paper";
import { errorColor } from "./Styles";

// Styled RN Paper body text
// props: variant (string), text (string), color (string), textAlign: (string)
const BodyText = (props) => {
    return (
        <Text
            variant={props.variant}
            style={{
                fontFamily: "Nunito-Medium",
                color: props.color,
                textAlign: props.textAlign,
            }}
        >
            {props.text}
        </Text>
    );
};

// Styled RN Paper error text
// props: variant (string), text (string)
const ErrorText = (props) => {
    return (
        <Text
            variant={props.variant}
            style={{ fontFamily: "Nunito-Medium", color: errorColor }}
        >
            {props.text}
        </Text>
    );
};

// Styled RN Paper required form text
// props: variant (string), text (string)
const RequiredFormText = (props) => {
    return (
        <Text
            variant={props.variant}
            style={{ fontFamily: "Nunito-Bold", color: errorColor }}
        >
            *
            <Text
                variant={props.variant}
                style={{ fontFamily: "Nunito-Medium" }}
            >
                {props.text}
            </Text>
        </Text>
    );
};

// Styled RN Paper title text
// props: variant (string), text (string), color (string), textAlign (string)
const TitleText = (props) => {
    return (
        <Text
            variant={props.variant}
            style={{
                fontFamily: "Nunito-Bold",
                color: props.color,
                textAlign: props.textAlign,
            }}
        >
            {props.text}
        </Text>
    );
};

export { BodyText, ErrorText, RequiredFormText, TitleText };
