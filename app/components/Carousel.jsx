import { FlatList } from "react-native";
import { CatCard } from "./CatCard";
import {
    formatLastFedSimple,
    formatLastSeenSimple,
} from "../utils/formatDetails";
import { Card, Paragraph } from "react-native-paper";
import { allStyles, screenMainColor } from "./Styles";
import { View } from "react-native";
import { BodyText } from "./Text";
import { dateTimeOptions } from "../data/DateTimeOptions";

// Function to get info1 field on the card
// @param carouselType: "concern" or "fed"
// @param cat: cat object with concernStatus or lastFedTime
// @return formatted string depending on carouselType or "Unknown" if any fields are missing
function getInfo1(carouselType, cat) {
    if (!cat || !carouselType) {
        return "Unknown";
    }

    if (
        carouselType === "concern" &&
        cat.concernStatus &&
        Object.keys(cat.concernStatus).length !== 0
    ) {
        const concerns = [];
        cat.concernStatus.injured && concerns.push("Injured");
        cat.concernStatus.missing && concerns.push("Missing");
        cat.concernStatus.new && concerns.push("New");

        return concerns.join(", ");
    } else if (carouselType === "unfed" && cat.lastFedTime) {
        return formatLastFedSimple(cat.lastFedTime);
    }
    return "Unknown";
}

// Card Carousel used in Dashboard, implemented using FlatList and snaps to each card
// props: cats (array of cat objects), cardWidth (number), carouselType (string), userRole (object of roles), ...card (props for card)
const CardCarousel = ({
    cats,
    cardWidth,
    carouselType,
    userRole,
    navigation,
    ...card
}) => {
    const spaceBetweenCards = 20;

    return (
        <FlatList
            testID="card-carousel"
            style={{ height: (cardWidth * 5) / 4 + 16 }}
            horizontal
            snapToAlignment="center"
            decelerationRate="normal"
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={4}
            snapToInterval={cardWidth + spaceBetweenCards}
            data={cats}
            keyExtractor={(item, index) => item.catID}
            renderItem={({ item }) => {
                return (
                    <CatCard
                        name={item.name}
                        photoURL={item.photoURLs ? item.photoURLs[0] : null}
                        cardWidth={cardWidth}
                        spaceBetweenCards={spaceBetweenCards}
                        profileOnPress={() =>
                            navigation.navigate("catalogue", {
                                screen: "CatProfile",
                                initial: false,
                                params: { catID: item.catID },
                            })
                        }
                        {...card}
                        info1={getInfo1(carouselType, item)}
                        info2={
                            item.locationName && item.locationZone && userRole
                                ? formatLastSeenSimple(
                                      userRole.isCaretaker
                                          ? item.locationName
                                          : item.locationZone,
                                      item.lastSeenTime
                                  )
                                : "Unknown"
                        }
                        showFindLocation={item.lastSeenLocation}
                        locationOnPress={() => {
                            navigation.navigate("Map", {
                                catID: item.catID,
                                location: item.lastSeenLocation,
                            });
                        }}
                        userRole={userRole}
                    />
                );
            }}
        />
    );
};

// Card Carousel used in Dashboard, implemented using FlatList and snaps to each card
// props: announcements (array of announcement objects), cardWidth (number)
const AnnouncementCarousel = ({ announcements, cardWidth }) => {
    const spaceBetweenCards = 20;
    return (
        <FlatList
            testID="announcement-carousel"
            style={{ height: cardWidth / 2 + 16 }}
            horizontal
            decelerationRate="normal"
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={4}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            data={announcements}
            renderItem={({ item, index }) => {
                return (
                    <Card
                        key={item.announcementID}
                        style={{
                            height: cardWidth / 2,
                            width: cardWidth,
                            borderRadius: 0,
                            margin: spaceBetweenCards / 2,
                            overflow: "hidden",
                        }}
                        theme={{
                            colors: { elevation: { level1: screenMainColor } },
                        }}
                        mode="elevated"
                    >
                        <Card.Content
                            style={{
                                paddingHorizontal: 12,
                            }}
                        >
                            <Paragraph
                                variant="bodyMedium"
                                style={[
                                    allStyles.bodyText,
                                    {
                                        height: "85%",
                                    },
                                ]}
                            >
                                {item.message}
                            </Paragraph>
                            <BodyText
                                variant="bodySmall"
                                text={
                                    "Updated At: " +
                                    item.updatedAt
                                        .toDate()
                                        .toLocaleString(
                                            "en-GB",
                                            dateTimeOptions
                                        ) +
                                    " (SGT)"
                                }
                            />
                        </Card.Content>
                    </Card>
                );
            }}
        />
    );
};

export { getInfo1, CardCarousel, AnnouncementCarousel };
