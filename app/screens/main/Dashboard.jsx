import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useAuth } from "../../utils/context/auth";
import { getCardWidth } from "../../utils/calculateItemWidths";
import { CardCarousel } from "../../components/Carousel";
import { cats } from "../../data/CatTempData"
import { useGetCatsofConcern, useGetUnfedCats } from "../../utils/db/cat";
import { useEffect } from "react";


// Eventual Call from DB
function getConcernCats() {
    const concernCats = cats.filter(cat => cat.concernStatus && cat.concernStatus.length != 0);
    return concernCats;
}

// Eventual Call from DB
function getUnfedCats() {
    const unfedCats = cats.filter(cat => {
        let today = new Date(2023, 5, 20, 13, 12, 0, 0);
        return cat.lastFedTime && ((today - cat.lastFedTime) / 3600000 > 12);
    })
    return unfedCats;
}


export const CarouselContainer = ({ titleText, subtitleText, loading, error, ...carousel }) => {
    return (
        <View>
            <View style={{ margin: 8 }}>
                <Text variant="headlineMedium">{titleText || "Title"}</Text>
                <Text variant="headlineSmall">{subtitleText || "Subtitle"}</Text>
            </View>
            {(error[0]) && <Text>Error: {error[0].message}</Text>}
            {(loading[0]) && <ActivityIndicator />}
            <CardCarousel {...carousel} />
        </View>
    );
}

export default function Dashboard() {
    const cardWidth = getCardWidth(2 / 3);
    const { getCatsofConcern, catsOfConcern, loading: loadingConcern, error: errorConcern } = useGetCatsofConcern();
    const { getUnfedCats, unfedCats, loading: loadingUnfed, error: errorUnfed } = useGetUnfedCats();

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([getCatsofConcern(), getUnfedCats()])
        }
        
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ScrollView>
            <CarouselContainer
                titleText="Cats of Concern"
                subtitleText="New, Injured, Missing >3 Days"
                carouselType="concern"
                cats={catsOfConcern}
                cardWidth={cardWidth || 250}
                iconName1="alert-circle-outline"
                field1="Status: "
                iconName2="location"
                field2="Last Seen: "
                loading={loadingConcern}
                error={errorConcern}
            />

            <CarouselContainer
                titleText="Unfed Cats"
                subtitleText="Not Fed in 12 Hours"
                carouselType="unfed"
                cats={unfedCats}
                cardWidth={cardWidth || 250}
                iconName1="time-outline"
                field1="Last Fed: "
                iconName2="location"
                field2="Last Seen: "
                loading={loadingUnfed}
                error={errorUnfed}
            />
        </ScrollView>
    );
}