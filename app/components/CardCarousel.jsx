import { FlatList, View } from "react-native";
import { useNavigation } from "expo-router";
import { CatCard } from "./CatCard";

const dateTimeOptions = {
    timeZone: "Asia/Singapore",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
}

const Carousel = ({cats, cardWidth, carouselType, ...card}) => {
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
                            info1={carouselType === "concern" 
                            ? item.concernStatus.join(", ") 
                            // : item.lastFedTime.toDate().toLocaleString("en-GB", dateTimeOptions) for TimeStamp
                            : item.lastFedTime.toLocaleString("en-GB", dateTimeOptions)}
                            info2={item.lastSeenLocation}
                        />
                    );
                }}
        />
    );
};

export { Carousel };