import { FlatList, View } from "react-native";
import { useNavigation } from "expo-router";
import { CatCard } from "./CatCard";
import { dateTimeOptions } from "../data/DateTimeOptions";

function getInfo1(carouselType, cat) {
    return carouselType === "concern" 
        ? cat.concernStatus.join(", ") 
        // : item.lastFedTime.toDate().toLocaleString("en-GB", dateTimeOptions) for TimeStamp
        : cat.lastFedTime.toLocaleString("en-GB", dateTimeOptions);
}

// Card Carousel used in Dashboard
const CardCarousel = ({cats, cardWidth, carouselType, ...card}) => {
    const navigation = useNavigation();
    const spaceBetweenCards = 24;

    return (
        <FlatList style={{ height: cardWidth }}
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
                        <CatCard cat={item}
                            cardWidth={cardWidth}
                            onPress={() => navigation.navigate("catalogue", 
                                { screen: "CatProfile", initial: false, params: { catID: item.catID }})}
                            {...card}
                            info1={getInfo1(carouselType, item)}
                            info2={item.lastSeenLocation}
                        />
                    );
                }}
        />
    );
};

export { CardCarousel };