import { FlatList, View } from "react-native";
import { useNavigation } from "expo-router";
import { CatCard } from "./CatCard";
import {
    formatLastFedSimple,
    formatLastSeenSimple,
} from "../utils/formatDetails";

function getInfo1(carouselType, cat) {
    if (!cat || !carouselType) {
        return "Unknown";
    }

    if (carouselType === "concern" && cat.concernStatus) {
        return cat.concernStatus.join(", ");
    } else if (carouselType === "unfed" && cat.lastFedTime) {
        return formatLastFedSimple(cat.lastFedTime);
    }
    return "Unknown";
}

// Card Carousel used in Dashboard
const CardCarousel = ({ cats, cardWidth, carouselType, userRole, ...card }) => {
    const navigation = useNavigation();
    const spaceBetweenCards = 16;

    return (
        <FlatList
            testID="card-carousel"
            style={{ height: (cardWidth * 6) / 5 }}
            horizontal
            snapToAlignment="center"
            decelerationRate="normal"
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={4}
            snapToInterval={cardWidth + spaceBetweenCards}
            ItemSeparatorComponent={() => (
                <View style={{ width: spaceBetweenCards }} />
            )}
            data={cats}
            keyExtractor={(item, index) => item.catID}
            renderItem={({ item }) => {
                return (
                    <CatCard
                        name={item.name}
                        photoURL={item.photoURLs ? item.photoURLs[0] : null}
                        cardWidth={cardWidth}
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

export { getInfo1, CardCarousel };
