import { Card } from "react-native-paper";;
import { IconTextField } from "./InfoText";

const CatCard = (props) => {
    const cardWidth = props.cardWidth ? props.cardWidth : 300;

    return (
        <Card style={{ height: cardWidth, width: cardWidth, margin: 4 }} 
            onPress={props.onPress}
            mode="elevated">
            <Card.Cover style={{ height: cardWidth / 2, width: cardWidth, resizeMode: "cover"}}
                testID="cover-image"
                source={props.photoURL || require("../../assets/placeholder.png")} 
            />
            <Card.Title title={props.name || "Name"} titleVariant="headlineMedium"/>
            <Card.Content style={{ paddingBottom: 0, paddingHorizontal: 4 }}>
                <IconTextField testID="infoText1"
                    iconName={props.iconName1} 
                    iconSize={24} 
                    variant="titleLarge"
                    field={props.field1}
                    info={props.info1}
                />
                <IconTextField testID="infoText2"
                    iconName={props.iconName2} 
                    iconSize={24} 
                    variant="titleLarge" 
                    field={props.field2}
                    info={props.info2}
                />
            </Card.Content>
        </Card>
    );
};

const CatCardSimple = (props) => {
    return (
        <Card style={{ flex: 1/2, margin: 4 }} 
            onPress={props.onPress}
            mode="elevated">
            <Card.Cover style={{ height: 3 * props.cardWidth / 4, width: props.cardWidth, resizeMode: "cover"}}
                testID="cover-image"
                source={props.photoURL || require("../../assets/placeholder.png")} 
            />
            <Card.Title title={props.name || "Name"} titleVariant="headlineMedium"/>
        </Card>
    );
};

export { CatCard, CatCardSimple };
