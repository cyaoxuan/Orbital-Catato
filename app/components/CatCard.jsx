import { Card } from "react-native-paper";
import { IconTextField } from "./InfoText";

const CatCard = (props) => {
    return (
        <Card style={{ height: 280, width: 280, margin: 4 }} 
            onPress={() => {}}
            mode="elevated">
            <Card.Cover style={{ height: 140, width: 280, resizeMode: "cover"}} 
                source={props.catImage} 
            />
            <Card.Title title={props.catName} titleVariant="headlineMedium"/>
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

export { CatCard };