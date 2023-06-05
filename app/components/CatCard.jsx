import { Card } from "react-native-paper";
import { useNavigation } from "expo-router";
import { IconTextField } from "./InfoText";
import { Dimensions } from "react-native";

const dateTimeOptions = {
    timeZone: "Asia/Singapore",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
}

const {height, width} = Dimensions.get("window");
const cardWidth = (width - (12 * 2 + 4)) / 4 * 3
const simpleCardWidth = (width - (12 * 2 + 4)) / 2;

const CatCard = (props) => {
    const navigation = useNavigation();
    const cat = props.cat;

    return (
        <Card style={{ height: cardWidth, width: cardWidth, margin: 4 }} 
            onPress={() => {
                // navigation.navigate("CatProfile", { name: cat.name })
                navigation.navigate("catalogue", { screen: "CatProfile", initial: false, params: { catID: cat.catID }})
            }}
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
                    info={props.cardType === "concern" 
                            ? cat.concernStatus.join(", ") 
                            : cat.lastFedTime.toLocaleString("en-GB", dateTimeOptions)}
                />
                <IconTextField 
                    iconName={props.iconName2} 
                    iconSize={24} 
                    variant="titleLarge" 
                    field={props.field2}
                    info={cat.lastSeenLocation}
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
            <Card.Cover style={{ height: 3 * simpleCardWidth / 4, width: simpleCardWidth, resizeMode: "cover"}} 
                source={cat.photoURL} 
            />
            <Card.Title title={cat.name} titleVariant="headlineMedium"/>
        </Card>
    );
};

export { CatCard, CatCardSimple };