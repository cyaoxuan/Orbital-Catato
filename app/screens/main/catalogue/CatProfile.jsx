import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { Stack, useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { cats } from "../../../data/CatTempData";
import { PillButton } from "../../../components/Button";
import { AvatarContainer, KeyInfoContainer, DetailsContainer, PhotosContainer } from "./ProfileContainers";

// Call cat data from database
function getCat(catID) {
    return cats.find((cat) => cat.catID === catID);
}

export default function CatProfile() {
    const route = useRoute();
    return <CatProfileScreen catID={route.params.catID} />
}

export function CatProfileScreen({catID}) {
    const navigation = useNavigation();
    const cat = getCat(catID);

    if (!cat) {
        return (
            <ScrollView>
                <Text>Cat not found: {catID}</Text>
            </ScrollView>
        );
    };

    return (
        <ScrollView>
            <Stack.Screen options={{ title: "Cat Profile" }} />
            
            <AvatarContainer name={cat.name} photoURL={cat.photoURLs[0]} />

            <KeyInfoContainer cat={cat} variant="bodyLarge" />

            <DetailsContainer cat={cat} variant="bodyLarge" iconSize={24} />

            <PhotosContainer photoURLs={cat.photoURLs} variant="bodyLarge" iconSize={24}
                onPress={() => {navigation.navigate("PhotoGallery", 
                { catID: cat.catID, name: cat.name, photoURLs: cat.photoURLs })}} />

            <View style={{ alignItems: "center" }}>
                <PillButton
                    label="Update Cat"
                    onPress={() => navigation.navigate("update", 
                        { screen: "Update", params: {catID: cat.catID, name: cat.name, photoURL: cat.photoURLs[0]}})}
                />
            </View>
        </ScrollView>
    );
}