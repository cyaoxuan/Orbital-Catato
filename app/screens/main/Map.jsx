import { useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { WebView } from 'react-native-webview';
import { useIsFocused } from '@react-navigation/native';
import { useGetAllCats } from "../../utils/db/cat";
import { useNavigation } from "expo-router";

export default function Map() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { getAllCats, allCats, loading, error } = useGetAllCats();

    useEffect(() => {
        const fetchData = async () => {
            await getAllCats();
        }

        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    return (
        <View style={{ flex: 1 }}>
            {(error[0]) && <Text>Error: {error[0].message}</Text>}
            {(loading[0]) && <ActivityIndicator />}
            <MapView testID="map"
                style={{ height: "100%" }}
                provider={PROVIDER_GOOGLE}
    
                showsUserLocation={true}

                region={{
                    latitude: 1.296769,
                    longitude: 103.776437,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}>

                {!error[0] && (
                    allCats.filter((cat) => cat.lastSeenLocation).map((cat, index) => {
                        return (
                            <Marker key={cat.catID} coordinate={cat.lastSeenLocation}>
                                <Callout style={{ height: 150, width: 150 }}
                                    onPress={() => navigation.navigate("catalogue", 
                                    { screen: "CatProfile", initial: false, params: { catID: cat.catID }})}>
                                    <View style={{ height: 150, width: 150 }}>
                                        <WebView style={{height: 100, width: 150}} 
                                            resizeMode="cover"
                                            source={cat.photoURLs ? {uri: cat.photoURLs[0]} : require("../../../assets/placeholder.png")} />
                                        <Text style={{ textAlign: "center" }}>{cat.name}</Text>
                                    </View>
                                </Callout>    
                            </Marker>
                        )
                    })
                )}
            </MapView>
        </View>  
    );
}