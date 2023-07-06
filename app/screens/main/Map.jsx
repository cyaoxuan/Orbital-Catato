import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { ActivityIndicator, Banner, Searchbar, Text } from "react-native-paper";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { WebView } from "react-native-webview";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useGetAllCats } from "../../utils/db/cat";
import { useAuth } from "../../utils/context/auth";
import { getRandomBuilding } from "../../utils/findLocation";

// Render Marker component
const RenderMarker = ({ cat, navigation, markers, random }) => {
    return (
        <Marker
            key={cat.catID}
            ref={(ref) => (markers[cat.catID] = ref)}
            coordinate={
                random
                    ? getRandomBuilding(cat.locationZone)
                    : cat.lastSeenLocation
            }
            tracksViewChanges={false}
            onCalloutPress={() =>
                navigation.navigate("catalogue", {
                    screen: "CatProfile",
                    initial: false,
                    params: { catID: cat.catID },
                })
            }
        >
            <Callout
                style={{ height: "auto", width: 175, alignItems: "center" }}
                onPress={() =>
                    navigation.navigate("catalogue", {
                        screen: "CatProfile",
                        initial: false,
                        params: { catID: cat.catID },
                    })
                }
            >
                {Platform.OS === "ios" ? (
                    <View
                        style={{
                            height: 200,
                            width: 175,
                            alignItems: "center",
                        }}
                    >
                        <View style={{ height: 15 }}></View>
                        <Image
                            style={styles.calloutImage}
                            resizeMode="cover"
                            source={
                                cat.photoURLs
                                    ? { uri: cat.photoURLs[0] }
                                    : require("../../../assets/placeholder.png")
                            }
                        />
                        <Text
                            variant="bodyLarge"
                            style={{ textAlign: "center" }}
                        >
                            {cat.name}
                        </Text>
                    </View>
                ) : (
                    <View
                        style={{
                            height: 175,
                            width: 175,
                            alignItems: "center",
                        }}
                    >
                        <View style={{ height: 15 }}></View>
                        <WebView
                            style={styles.calloutImage}
                            scalesPageToFit={true}
                            source={
                                cat.photoURLs
                                    ? { uri: cat.photoURLs[0] }
                                    : require("../../../assets/placeholder.png")
                            }
                        />
                        <Text
                            variant="bodyLarge"
                            style={{ textAlign: "center" }}
                        >
                            {cat.name}
                        </Text>
                    </View>
                )}
            </Callout>
        </Marker>
    );
};

// Render Searchbar PredictionRow component
const RenderPredictionRow = ({ item, onPress }) => {
    return (
        <TouchableOpacity
            style={{ width: "100%" }}
            onPress={onPress}
            disabled={!item.lastSeenLocation}
        >
            {item.lastSeenLocation ? (
                <View style={styles.predictionRow}>
                    <Text>{item.name}</Text>
                    <Text>{item.locationName}</Text>
                </View>
            ) : (
                <View style={styles.predictionRow}>
                    <Text style={{ color: "grey" }}>{item.name}</Text>
                    <Text style={{ color: "grey" }}>Unknown</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default function Map() {
    const { userRole } = useAuth();

    // To check if map is ready
    const [mapReady, setMapReady] = useState(false);

    // For map dimensions
    const { width, height } = Dimensions.get("window");

    // For markers to show callouts
    const markers = [];

    // For map animation
    const mapRef = useRef(null);

    const animateToRegion = (catID, location) => {
        mapRef.current?.animateToRegion(
            { ...location, latitudeDelta: 0.003, longitudeDelta: 0.003 },
            1000
        );
        markers[catID].showCallout();
    };

    // Uses route params to bring user to location
    const route = useRoute();
    const initialRegion = mapReady && route.params?.catID && route.params?.location ? {
        ...route.params.location,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
    } : {
        latitude: 1.296769,
        longitude: 103.776437,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    }

    // For navigating to profile
    const navigation = useNavigation();

    // For refreshing when coming back to page
    const isFocused = useIsFocused();

    // For search bar
    const [showPredictions, setShowPredictions] = useState(false);
    const [searchCats, setSearchCats] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const onChangeSearch = (query) => {
        setSearchQuery(query);
        let filteredCats = allCats.filter(
            (item) =>
                item.name !== null &&
                item.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchCats(filteredCats);
    };

    // Fetch from DB
    const { getAllCats, allCats, loading, error } = useGetAllCats();

    useEffect(() => {
        const fetchData = async () => {
            await getAllCats();
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    useEffect(() => {
        if (allCats) {
            setSearchCats([...allCats.filter((cat) => cat.name)]);
        }
    }, [allCats]);

    if (!userRole) {
        return <ActivityIndicator />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            style={{ flex: 1 }}
        >
            {error[0] && <Text>Error: {error[0].message}</Text>}
            {loading[0] && <ActivityIndicator />}

            <MapView
                style={styles.map}
                testID="map"
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                onMapReady={() => setMapReady(true)}
                showsCompass
                zoomEnabled
                zoomControlEnabled
                onPress={() => {
                    Keyboard.dismiss();
                    setShowPredictions(false);
                }}
                onRegionChange={() => {
                    Keyboard.dismiss();
                    setShowPredictions(false);
                }}
                region={initialRegion}
            >
                {!error[0] && userRole && userRole.isCaretaker
                    ? allCats
                          .filter((cat) => cat.lastSeenLocation)
                          .map((cat, index) => (
                              <RenderMarker
                                  key={cat.catID}
                                  cat={cat}
                                  navigation={navigation}
                                  markers={markers}
                              />
                          ))
                    : allCats
                          .filter(
                              (cat) =>
                                  cat.lastSeenLocation &&
                                  cat.locationZone !== "Outside NUS"
                          )
                          .map((cat, index) => (
                              <RenderMarker
                                  key={cat.catID}
                                  cat={cat}
                                  navigation={navigation}
                                  markers={markers}
                                  random={true}
                              />
                          ))}
            </MapView>
            <View
                style={{
                    position: "absolute",
                    top: 10,
                    width: width,
                    height: showPredictions ? 250 : 50,
                    alignItems: "center",
                }}
            >
                {userRole && userRole.isCaretaker ? (
                    <Searchbar
                        style={{ width: "95%", alignSelf: "center" }}
                        theme={{ colors: { elevation: { level3: "white" } } }}
                        elevation={2}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        onFocus={() => setShowPredictions(true)}
                    />
                ) : (
                    <View
                        elevation={2}
                        style={{
                            height: 75,
                            width: "95%",
                            backgroundColor: "white",
                            borderWidth: 1,
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            variant="bodyMedium"
                            style={{
                                marginHorizontal: 12,
                                textAlign: "center",
                            }}
                        >
                            Cat locations are randomly generated within zones
                            they were last seen in. Precise locations are not
                            given to non-caretakers for their safety!
                        </Text>
                    </View>
                )}
                {showPredictions && (
                    <FlatList
                        style={[styles.predictionsContainer]}
                        keyboardShouldPersistTaps="handled"
                        data={searchCats}
                        keyExtractor={(item) => item.catID}
                        renderItem={({ item, index }) => {
                            return (
                                <RenderPredictionRow
                                    item={item}
                                    onPress={() =>
                                        animateToRegion(
                                            item.catID,
                                            item.lastSeenLocation
                                        )
                                    }
                                />
                            );
                        }}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    calloutImage: {
        height: 150,
        width: 150,
        padding: 0,
        margin: 0,
    },
    predictionsContainer: {
        width: "90%",
        backgroundColor: "white",
        padding: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    predictionRow: {
        paddingHorizontal: 10,
        paddingBottom: 15,
        marginBottom: 15,
        borderBottomColor: "grey",
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
