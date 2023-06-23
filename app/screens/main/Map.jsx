import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { ActivityIndicator, Searchbar, Text } from "react-native-paper";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { WebView } from "react-native-webview";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useGetAllCats } from "../../utils/db/cat";

// Render Marker component
const RenderMarker = ({ cat, navigation }) => {
    return (
        <Marker key={cat.catID} coordinate={cat.lastSeenLocation}>
            <Callout
                style={{ height: 150, width: 150 }}
                onPress={() =>
                    navigation.navigate("catalogue", {
                        screen: "CatProfile",
                        initial: false,
                        params: { catID: cat.catID },
                    })
                }
            >
                <View style={{ height: 150, width: 150 }}>
                    <WebView
                        style={{ height: 100, width: 150 }}
                        resizeMode="cover"
                        source={
                            cat.photoURLs
                                ? { uri: cat.photoURLs[0] }
                                : require("../../../assets/placeholder.png")
                        }
                    />
                    <Text style={{ textAlign: "center" }}>{cat.name}</Text>
                </View>
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

    // For map animation
    const mapRef = useRef(null);

    const animateToRegion = (location) => {
        mapRef.current?.animateToRegion(
            { ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 },
            1000
        );
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            enabled={false}
        >
            {error[0] && <Text>Error: {error[0].message}</Text>}
            {loading[0] && <ActivityIndicator />}

            <MapView
                testID="map"
                ref={mapRef}
                style={{ height: "100%" }}
                provider={PROVIDER_GOOGLE}
                onPress={() => {
                    Keyboard.dismiss();
                    setShowPredictions(false);
                }}
                onRegionChange={() => {
                    Keyboard.dismiss();
                    setShowPredictions(false);
                }}
                region={{
                    latitude: 1.296769,
                    longitude: 103.776437,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                {!error[0] &&
                    allCats
                        .filter((cat) => cat.lastSeenLocation)
                        .map((cat, index) => (
                            <RenderMarker
                                key={cat.catID}
                                cat={cat}
                                navigation={navigation}
                            />
                        ))}
            </MapView>
            <View
                style={{
                    position: "absolute",
                    top: 10,
                    width: "100%",
                    height: 250,
                    alignItems: "center",
                }}
            >
                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    onFocus={() => setShowPredictions(true)}
                />
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
                                        animateToRegion(item.lastSeenLocation)
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
});
