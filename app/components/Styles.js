import { StyleSheet } from "react-native";

export const screenMainColor = "white";
export const screenSecondaryColor = "#F8F9FD";
export const primaryColor = "#FBAB4B";
export const primaryColorLight = "#FFEAD3";
export const secondaryColor = "#05668D";
export const secondaryColorLight = "#E5F1F6";
export const errorColor = "#BA1A1A";

export const allStyles = StyleSheet.create({
    titleText: {
        fontFamily: "Nunito-Bold",
    },
    bodyText: {
        fontFamily: "Nunito-Medium",
    },
    buttonText: {
        fontFamily: "Nunito-Medium",
        fontSize: 16,
    },
    centerFlexView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    roundedView: {
        backgroundColor: "white",
        margin: 8,
        padding: 16,
        borderRadius: 16,
    },
    roundedOptionView: {
        backgroundColor: "white",
        marginHorizontal: 8,
        borderRadius: 16,
        overflow: "hidden",
    },
    listSection: {
        marginVertical: 0,
    },
});
