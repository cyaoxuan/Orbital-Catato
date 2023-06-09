import { Card } from "react-native-paper";;
import { IconTextField } from "./InfoText";

const CatCard = (props) => {
    const cat = props.cat;
    const cardWidth = props.cardWidth;

    return (
        <Card style={{ height: 7 * cardWidth / 8, width: cardWidth, margin: 4 }} 
            onPress={props.onPress}
            mode="elevated">
            <Card.Cover style={{ height: cardWidth / 2, width: cardWidth, resizeMode: "cover"}} 
                source={cat.photoURL} 
            />
            <Card.Title title={cat.name} titleVariant="headlineMedium"/>
            <Card.Content style={{ paddingBottom: 0, paddingHorizontal: 4 }}>
                <IconTextField 
                    iconName={props.iconName1} 
                    iconSize={24} 
                    variant="titleLarge"
                    field={props.field1}
                    info={props.info1}
                />
                <IconTextField 
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
    const cat = props.cat;

    return (
        <Card style={{ flex: 1/2, margin: 4 }} 
            onPress={props.onPress}
            mode="elevated">
            <Card.Cover style={{ height: 3 * props.cardWidth / 4, width: props.cardWidth, resizeMode: "cover"}} 
                source={cat.photoURL} 
            />
            <Card.Title title={cat.name} titleVariant="headlineMedium"/>
        </Card>
    );
};

export { CatCard, CatCardSimple };
