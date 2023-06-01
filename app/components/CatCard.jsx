import { Card } from "react-native-paper";
import { IconTextField } from "./InfoText";

const dateTimeOptions = {
    timeZone: "Asia/Singapore",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
}

const CatCard = (props) => {
    return (
        <Card style={{ height: 280, width: 280, margin: 4 }} 
            onPress={() => {}}
            mode="elevated">
            <Card.Cover style={{ height: 140, width: 280, resizeMode: "cover"}} 
                source={props.cat.photoURL} 
            />
            <Card.Title title={props.cat.name} titleVariant="headlineMedium"/>
            <Card.Content style={{ paddingBottom: 0, paddingHorizontal: 4 }}>
                <IconTextField 
                    iconName={props.iconName1} 
                    iconSize={24} 
                    variant="titleLarge"
                    field={props.field1}
                    info={props.cardType === "concern" 
                            ? props.cat.concernStatus.join(", ") 
                            : props.cat.lastFedTime.toLocaleString("en-GB", dateTimeOptions)}
                />
                <IconTextField 
                    iconName={props.iconName2} 
                    iconSize={24} 
                    variant="titleLarge" 
                    field={props.field2}
                    info={props.cat.lastSeenTime.toLocaleString("en-GB", dateTimeOptions)}
                />
            </Card.Content>
        </Card>
    );
};


export { CatCard };