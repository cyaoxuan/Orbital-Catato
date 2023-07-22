import { Image } from "react-native";

export const PantingCat = ({ size }) => {
    return (
        <Image
            source={require("../../assets/drawing-cats/cat-drawing-1.png")}
            style={{ height: size, width: size }}
        />
    );
};

export const PopCat = ({ size }) => {
    return (
        <Image
            source={require("../../assets/drawing-cats/cat-drawing-2.png")}
            style={{ height: size, width: size }}
        />
    );
};

export const SmilingGingerCat = ({ size }) => {
    return (
        <Image
            source={require("../../assets/drawing-cats/cat-drawing-3.png")}
            style={{ height: size, width: size }}
        />
    );
};

export const LoadingCat = ({ size }) => {
    return (
        <Image
            source={require("../../assets/drawing-cats/cat-drawing-4.png")}
            style={{ height: size, width: size }}
        />
    );
};

export const MaxwellCat = ({ size }) => {
    return (
        <Image
            source={require("../../assets/drawing-cats/cat-drawing-5.png")}
            style={{ height: size, width: size }}
        />
    );
};

export const SaladSmudgeCat = ({ size }) => {
    return (
        <Image
            source={require("../../assets/drawing-cats/cat-drawing-6.png")}
            style={{ height: size, width: size }}
        />
    );
};

export const StandingCat = ({ size }) => {
    return (
        <Image
            source={require("../../assets/drawing-cats/cat-drawing-7.png")}
            style={{ height: size, width: size }}
        />
    );
};
