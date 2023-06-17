import { FlatList, View } from "react-native";
import { useNavigation } from "expo-router";
import { CatCard } from "./CatCard";
import { formatLastFed, formatLastSeenSimple } from "../utils/formatDetails";

function getInfo1(carouselType, cat) {
    if (!cat || !carouselType) {
        return "Unknown";
    }

    if (carouselType === "concern" && cat.concernStatus) {
        return cat.concernStatus.join(", ");
    } else if (carouselType === "unfed" && cat.lastFedTime) {
        return formatLastFed(cat.lastFedTime);
    }
    return "Unknown";
}

// Card Carousel used in Dashboard
const CardCarousel = ({cats, cardWidth, carouselType, ...card}) => {
    const navigation = useNavigation();
    const spaceBetweenCards = 24;

    return (
        <FlatList testID="card-carousel"
            style={{ height: cardWidth }}
            horizontal
            snapToAlignment="center"
            decelerationRate="normal"
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={4}
            snapToInterval={cardWidth + spaceBetweenCards}
            ItemSeparatorComponent={() => <View style={{width: spaceBetweenCards}} />}
            
            data={cats}
            keyExtractor={(item, index) => item.catID}
            renderItem={({item}) => {
                return (
                    <CatCard 
                        name={item.name}
                        photoURL={item.photoURLs[0]}
                        cardWidth={cardWidth}
                        onPress={() => navigation.navigate("catalogue", 
                            { screen: "CatProfile", initial: false, params: { catID: item.catID }})}
                        {...card}
                        info1={getInfo1(carouselType, item)}
                        info2={item.lastSeenLocation 
                            ? formatLastSeenSimple(item.lastSeenLocation, item.lastSeenTime)
                            : "Unknown"}
                    />
                );
            }}
        />
    );
};

export { getInfo1, CardCarousel };