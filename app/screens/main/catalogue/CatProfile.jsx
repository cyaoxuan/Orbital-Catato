import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { cats } from "../../../data/CatTempData";
import { PillButton } from "../../../components/Button";
import { AvatarContainer, KeyInfoContainer, DetailsContainer, PhotosContainer } from "./ProfileContainers";
import { useEffect, useState } from "react";
import { useGetCat } from "../../../utils/db/cat";

export default function CatProfile() {
    const route = useRoute();
    const catID = route.params.catID;
    const navigation = useNavigation();
    const { getCat, cat, loading, error } = useGetCat();
    const [partialCat, setPartialCat] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            await getCat(catID);
        }
        
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [catID]);

    useEffect(() => {
        if (cat) {
            const partialCatTemp = (({catID, name, photoURLs, gender, birthYear, sterilised, keyFeatures, concernStatus, concernDesc}) => 
                ({ catID, name, photoURLs, gender, birthYear, sterilised, keyFeatures, concernStatus, concernDesc }))(cat); 
            setPartialCat(partialCatTemp);
        }
    }, [cat])
    
    if (!cat) {
        return (
            <ScrollView>
                <Text>No cat (yet)</Text>
            </ScrollView>
        );
    }

    return (
        <ScrollView testID="profile-container">
            <AvatarContainer name={cat.name} photoURL={cat.photoURLs[0]} />

            <KeyInfoContainer cat={cat} variant="bodyMedium" />

            <DetailsContainer cat={cat} variant="bodyMedium" iconSize={24} />

            <PhotosContainer photoURLs={cat.photoURLs} variant="bodyLarge" iconSize={24}
                onPress={() => {navigation.navigate("PhotoGallery", 
                { catID: cat.catID, name: cat.name, photoURLs: cat.photoURLs })}} />

            <View style={{ alignItems: "center" }}>
                <PillButton
                    label="Update Cat"
                    onPress={() => navigation.navigate("update", 
                        { screen: "Update", params: {cat: partialCat}})}
                />
            </View>
        </ScrollView>
    );
}