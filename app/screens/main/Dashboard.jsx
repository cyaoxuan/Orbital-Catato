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
import { useNavigation } from "expo-router";

// Container for Carousels
// props: titleText (string), subtitleText (string), loading (array from db util), error (array from db util),
// cats (array of cat objects), ...carousel (carousel props)
export const CarouselContainer = ({
    titleText,
    subtitleText,
    loading,
    error,
    cats,
    ...carousel
}) => {
    return (
        <View>
            <View style={{ margin: 8 }}>
                <Text variant="headlineMedium">{titleText || "Title"}</Text>
                <Text variant="bodyLarge">{subtitleText || "Subtitle"}</Text>
            </View>
            {error[0] && <Text>Error: {error[0].message}</Text>}
            {loading[0] ? (
                <ActivityIndicator />
            ) : (
                cats.length === 0 && <Text>No cats in this category! :D</Text>
            )}
            <CardCarousel {...carousel} cats={cats} />
        </View>
    );
};

export default function Dashboard() {
    const { userRole } = useAuth();
    const navigation = useNavigation();
    const cardWidth = getItemWidthFrac(5 / 6);
    // For refresh and showing update time
    const [refreshing, setRefreshing] = useState(false);
    const [updateTime, setUpdateTime] = useState(new Date());

    // Refresh control callback
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            setUpdateTime(new Date());
        }, 500);
    }, []);

    // DB Utils to fetch cat data
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

    // If user role is not loaded yet, show loading
    if (!userRole) {
        return <ActivityIndicator />;
    }

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
                userRole={userRole}
                navigation={navigation}
            />

            {userRole && userRole.isCaretaker && (
                // Do not show unfed if not caretaker
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
                    userRole={userRole}
                    navigation={navigation}
                />
            )}

            {/* show last update time */}
            <View style={{ margin: 8 }}>
                <Text variant="bodyMedium" style={{ color: "grey" }}>
                    Scroll Up to Refresh
                </Text>
                <Text variant="bodyMedium" style={{ color: "grey" }}>
                    Last Updated: {updateTime.toLocaleString()}
                </Text>
            </View>
        </ScrollView>
    );
}
