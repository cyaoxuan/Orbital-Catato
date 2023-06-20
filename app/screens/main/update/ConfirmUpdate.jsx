import { View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import { PillButton } from "../../../components/Button";

export default function ConfirmUpdate() {
    const navigation = useNavigation();
    
    const route = useRoute();
    
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <CatAvatar 
            photoURL={ route.params.photoURLs[0] }
            size={200}
            variant="headlineLarge"
            name={ route.params.name }
        />
        
        <Text style={{ marginHorizontal: 100, paddingVertical: 20, textAlign: "center" }}>
            Thank you for your contribution!</Text>

        <PillButton
            label="Make More Updates"
            onPress={() => {navigation.navigate("Update")}} // send param of current cat, send back to prev page unless proceed
        />
        </View>
    );
}
