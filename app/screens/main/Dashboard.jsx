import { RefreshControl, ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useAuth } from "../../utils/context/auth";
import { getItemWidthFrac } from "../../utils/calculateItemWidths";
import { CardCarousel } from "../../components/Carousel";
import { useCallback, useEffect, useState } from "react";
import {
    autoProcessConcernStatus,
    useGetCatsofConcern,
    useGetUnfedCats,
} from "../../utils/db/cat";

export const CarouselContainer = ({
    titleText,
    subtitleText,
    loading,
    error,
    ...carousel
}) => {
    return (
        <View>
            <View style={{ margin: 8 }}>
                <Text variant="headlineMedium">{titleText || "Title"}</Text>
                <Text variant="headlineSmall">
                    {subtitleText || "Subtitle"}
                </Text>
            </View>
            {error[0] && <Text>Error: {error[0].message}</Text>}
            {loading[0] && <ActivityIndicator />}
            <CardCarousel {...carousel} />
        </View>
    );
};

export default function Dashboard() {
    const [refreshing, setRefreshing] = useState(false);
    const cardWidth = getItemWidthFrac(3 / 4);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    const {
        getCatsofConcern,
        catsOfConcern,
        loading: loadingConcern,
        error: errorConcern,
    } = useGetCatsofConcern();
    const {
        getUnfedCats,
        unfedCats,
        loading: loadingUnfed,
        error: errorUnfed,
    } = useGetUnfedCats();

    useEffect(() => {
        const fetchData = async () => {
            await autoProcessConcernStatus();
            await Promise.all([getCatsofConcern(), getUnfedCats()]);
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshing]);

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <CarouselContainer
                titleText="Cats of Concern"
                subtitleText="New, Injured, Missing >3 Days"
                carouselType="concern"
                cats={catsOfConcern}
                cardWidth={cardWidth || 250}
                iconName1="alert-circle-outline"
                field1="Status: "
                iconName2="location"
                field2="Seen: "
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
                field2="Seen: "
                loading={loadingUnfed}
                error={errorUnfed}
            />
        </ScrollView>
    );
}
