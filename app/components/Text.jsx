import { Text } from "react-native-paper";

// Styled RN Paper body text
// props: variant (string), text (string), color (string)
const BodyText = (props) => {
    return (
        <Text
            variant={props.variant}
            style={{ fontFamily: "Nunito-Medium", color: props.color }}
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
            style={{ fontFamily: "Nunito-Medium", color: "#BA1A1A" }}
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
            style={{ fontFamily: "Nunito-Bold", color: "#BA1A1A" }}
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
// props: variant (string), text (string), color (string)
const TitleText = (props) => {
    return (
        <Text
            variant={props.variant}
            style={{ fontFamily: "Nunito-Bold", color: props.color }}
        >
            {props.text}
        </Text>
    );
};

export { BodyText, ErrorText, RequiredFormText, TitleText };
