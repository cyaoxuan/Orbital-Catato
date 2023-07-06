import { Button, Card } from "react-native-paper";
import { IconTextField } from "./InfoText";
import Ionicons from "@expo/vector-icons/Ionicons";

const CatCard = (props) => {
    const cardWidth = props.cardWidth ? props.cardWidth : 300;

    return (
        <Card
            style={{
                height: (cardWidth * 11) / 10,
                width: cardWidth,
                margin: 4,
            }}
            mode="elevated"
        >
            <Card.Cover
                style={{
                    height: (cardWidth * 7) / 12,
                    width: cardWidth,
                    resizeMode: "cover",
                }}
                testID="cover-image"
                source={
                    props.photoURL
                        ? { uri: props.photoURL }
                        : require("../../assets/placeholder.png")
                }
            />
            <Card.Title
                title={props.name || "Name"}
                titleVariant="titleLarge"
            />
            <Card.Content style={{ paddingHorizontal: 4 }}>
                <IconTextField
                    testID="infoText1"
                    iconName={props.iconName1}
                    iconSize={20}
                    variant="bodyLarge"
                    field={props.field1}
                    info={props.info1}
                />
                <IconTextField
                    testID="infoText2"
                    iconName={props.iconName2}
                    iconSize={20}
                    variant="bodyLarge"
                    field={props.field2}
                    info={props.info2}
                />
            </Card.Content>
            <Card.Actions>
                <Button
                    onPress={props.profileOnPress}
                    icon={() => (
                        <Ionicons name="heart" size={20} color="#663399" />
                    )}
                >
                    Profile
                </Button>
                {props.userRole?.isCaretaker && (
                    <Button
                        disabled={
                            props.showFindLocation === undefined ? true : false
                        }
                        onPress={props.locationOnPress}
                        icon={() => (
                            <Ionicons name="location" size={20} color="white" />
                        )}
                    >
                        Locate
                    </Button>
                )}
            </Card.Actions>
        </Card>
    );
};

const CatCardSimple = (props) => {
    return (
        <Card
            style={{ flex: 1 / 2, margin: 8 }}
            onPress={props.onPress}
            mode="elevated"
        >
            <Card.Cover
                style={{
                    height: (3 * props.cardWidth) / 4,
                    width: props.cardWidth,
                    resizeMode: "cover",
                }}
                testID="cover-image"
                source={
                    props.photoURL
                        ? { uri: props.photoURL }
                        : require("../../assets/placeholder.png")
                }
            />
            <Card.Title
                title={props.name || "Name"}
                titleVariant="bodyLarge"
                titleNumberOfLines={2}
            />
        </Card>
    );
};

export { CatCard, CatCardSimple };
