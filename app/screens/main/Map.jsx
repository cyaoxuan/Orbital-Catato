import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function Map() {
    return (
        <View style={{ flex: 1 }}>
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
                
                <Marker coordinate={{latitude: 1.296769, longitude: 103.776437,}} title="Meow!" />
            </MapView>
        </View>  
    );
}