import { RefreshControl, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../utils/context/auth";
import { getItemWidthFrac } from "../../utils/calculateItemWidths";
import { AnnouncementCarousel, CardCarousel } from "../../components/Carousel";
import { useCallback, useEffect, useState } from "react";
import {
    autoProcessConcernStatus,
    useGetCatsofConcern,
    useGetUnfedCats,
} from "../../utils/db/cat";
import { useNavigation } from "expo-router";
import { BodyText, ErrorText, TitleText } from "../../components/Text";
import { screenSecondaryColor, secondaryColor } from "../../components/Styles";
import { dateTimeOptions } from "../../data/DateTimeOptions";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGetAnnouncements } from "../../utils/db/announcement";

// Container for Announcement
// props: userRole (object), navigation (navigator), errorAnnounce (array), loadingAnnounce (array),
// announcements (array of objects), cardWidth (number)

export const AnnouncementContainer = ({
    userRole,
    navigation,
    errorAnnounce,
    loadingAnnounce,
    announcements,
    cardWidth,
}) => {
    return (
        <View>
            <View
                style={{
                    marginLeft: 16,
                    marginTop: 8,
                }}
            >
                <View
                    style={{
                        marginTop: 8,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <TitleText variant="headlineMedium" text="Announcements" />
                    {userRole.isAdmin && (
                        <TouchableOpacity
                            testID="view-button"
                            onPress={() =>
                                navigation.navigate("settings", {
                                    screen: "AdminPanel",
                                    initial: false,
                                })
                            }
                        >
                            <View style={{ flexDirection: "row" }}>
                                <BodyText
                                    variant="bodyLarge"
                                    text="Edit"
                                    color={secondaryColor}
                                />
                                <Ionicons
                                    name="chevron-forward"
                                    size={24}
                                    color={secondaryColor}
                                    style={{ marginHorizontal: 4 }}
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>

                {errorAnnounce[0] && (
                    <ErrorText
                        variant="bodyMedium"
                        text={"Error: " + errorAnnounce[0].message}
                    />
                )}
                {loadingAnnounce[0] ? (
                    <ActivityIndicator color={secondaryColor} />
                ) : (
                    !announcements && (
                        <BodyText
                            variant="bodyMedium"
                            text="No announcements!"
                        />
                    )
                )}
            </View>

            <AnnouncementCarousel
                announcements={announcements}
                cardWidth={cardWidth}
            />
        </View>
    );
};

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
            <View style={{ margin: 16 }}>
                <TitleText
                    variant="headlineMedium"
                    text={titleText || "Title"}
                />
                <BodyText
                    variant="bodyMedium"
                    text={subtitleText || "Subtitle"}
                />
                {error[0] && (
                    <ErrorText
                        variant="bodyMedium"
                        text={"Error: " + error[0].message}
                    />
                )}
                {loading[0] ? (
                    <ActivityIndicator color={secondaryColor} />
                ) : (
                    cats.length === 0 && (
                        <BodyText
                            variant="bodyMedium"
                            text="No cats in this category! :D"
                        />
                    )
                )}
            </View>
            <CardCarousel {...carousel} cats={cats} />
        </View>
    );
};

export default function Dashboard() {
    const { userRole } = useAuth();
    const navigation = useNavigation();
    const cardWidth = getItemWidthFrac(3 / 4);
    // For refresh and showing update time
    const [refreshing, setRefreshing] = useState(false);
    const [updateTime, setUpdateTime] = useState(new Date());

    // Refresh control callback
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    // DB Utils to fetch announcements
    const {
        announcements,
        getAnnouncements,
        loading: loadingAnnounce,
        error: errorAnnounce,
    } = useGetAnnouncements();

    useEffect(() => {
        const fetchData = async () => {
            await getAnnouncements();
            setUpdateTime(new Date());
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshing]);

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
            setUpdateTime(new Date());
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshing]);

    // If user role is not loaded yet, show loading
    if (!userRole) {
        return <ActivityIndicator color={secondaryColor} />;
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ backgroundColor: screenSecondaryColor }}
        >
            <AnnouncementContainer
                userRole={userRole}
                navigation={navigation}
                errorAnnounce={errorAnnounce}
                loadingAnnounce={loadingAnnounce}
                announcements={announcements}
                cardWidth={cardWidth}
            />

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
            <View style={{ margin: 10, alignItems: "center" }}>
                <BodyText
                    variant="bodyMedium"
                    text="Scroll Up to Refresh"
                    color="grey"
                />

                <BodyText
                    variant="bodyMedium"
                    text={
                        "Last Updated: " +
                        updateTime.toLocaleString("en-GB", dateTimeOptions)
                    }
                    color="grey"
                />
            </View>
        </ScrollView>
    );
}
