import { Button, Card } from "react-native-paper";
import { IconTextFieldRow } from "./InfoText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { allStyles, screenMainColor, secondaryColor } from "./Styles";
import { View } from "react-native";

// Card used for the Carousel in Dashboard
// props: cardWidth (number), spaceBetweenCards (number), photoURL (string), name (string), userRole (object of roles)
// iconName1 (string), field1 (string), info1 (string), iconName2 (string), field2 (string), info2 (string)
// profileOnPress (calback), locationOnPress (callback), showFindLocation (boolean)
const CatCard = (props) => {
    const cardWidth = props.cardWidth ? props.cardWidth : 300;
    const spaceBetweenCards = props.spaceBetweenCards
        ? props.spaceBetweenCards
        : 20;
    const buttonColor = secondaryColor;

    return (
        <View style={{ overflow: "hidden" }}>
            <Card
                style={{
                    height: (cardWidth * 5) / 4,
                    width: cardWidth,
                    margin: spaceBetweenCards / 2,
                    borderRadius: 20,
                    overflow: "hidden",
                }}
                theme={{
                    colors: { elevation: { level1: screenMainColor } },
                }}
                mode="elevated"
            >
                <Card.Cover
                    style={{
                        height: (cardWidth * 2) / 3,
                        width: cardWidth,
                        resizeMode: "cover",
                    }}
                    theme={{
                        roundness: 0,
                        isV3: false,
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
                    titleStyle={allStyles.titleText}
                />
                <Card.Content style={{ paddingHorizontal: 8 }}>
                    <IconTextFieldRow
                        testID="infoText1"
                        iconName={props.iconName1}
                        iconSize={20}
                        variant="bodyMedium"
                        field={props.field1}
                        info={props.info1}
                    />
                    <IconTextFieldRow
                        testID="infoText2"
                        iconName={props.iconName2}
                        iconSize={20}
                        variant="bodyMedium"
                        field={props.field2}
                        info={props.info2}
                    />
                </Card.Content>
                <Card.Actions>
                    <Button
                        compact={true}
                        textColor={buttonColor}
                        style={{
                            borderColor: buttonColor,
                            height: 36,
                        }}
                        contentStyle={{ height: 36 }}
                        labelStyle={[
                            allStyles.bodyText,
                            {
                                fontSize: 16,
                                padding: 0,
                                margin: 0,
                            },
                        ]}
                        onPress={props.profileOnPress}
                        icon={() => (
                            <Ionicons
                                name="heart"
                                size={16}
                                color={buttonColor}
                            />
                        )}
                    >
                        Profile
                    </Button>
                    {props.userRole?.isCaretaker && (
                        <Button
                            buttonColor={buttonColor}
                            style={{
                                height: 36,
                            }}
                            contentStyle={{
                                height: 36,
                            }}
                            labelStyle={[
                                allStyles.bodyText,
                                {
                                    fontSize: 16,
                                    padding: 0,
                                    margin: 0,
                                },
                            ]}
                            disabled={
                                props.showFindLocation === undefined
                                    ? true
                                    : false
                            }
                            onPress={props.locationOnPress}
                            icon={() => (
                                <Ionicons
                                    name="location"
                                    size={16}
                                    color="white"
                                />
                            )}
                        >
                            Locate
                        </Button>
                    )}
                </Card.Actions>
            </Card>
        </View>
    );
};

// Card used for SelectCat in Update forms
// props: cardWidth (number), photoURL (string), name (string), onPress (callback)
const CatCardSimple = (props) => {
    return (
        <View style={{ overflow: "hidden" }}>
            <Card
                style={{
                    flex: 1 / 2,
                    margin: 8,
                    borderRadius: 10,
                    overflow: "hidden",
                }}
                theme={{
                    colors: { elevation: { level1: screenMainColor } },
                }}
                onPress={props.onPress}
                mode="elevated"
            >
                <Card.Cover
                    style={{
                        height: (3 * props.cardWidth) / 4,
                        width: props.cardWidth,
                        resizeMode: "cover",
                    }}
                    theme={{
                        roundness: 4,
                        isV3: false,
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
                    titleStyle={allStyles.bodyText}
                    titleNumberOfLines={2}
                />
            </Card>
        </View>
    );
};

export { CatCard, CatCardSimple };
