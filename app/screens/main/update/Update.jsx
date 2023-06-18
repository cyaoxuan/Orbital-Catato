import { View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import { PillButton } from "../../../components/Button";

export default function Update() {
    const navigation = useNavigation();
    
    const route = useRoute();
    // Check if there are route params from SelectCat, if not ask user to Select Cat
    const cat = route.params?.cat ? route.params.cat : null;
    const catID = cat ? cat.catID : null;
    const name = cat ? cat.name : "Select Cat";
    const photoURL = (cat && cat.photoURLs.length > 0)
        ? cat.photoURLs[0]
        : require("../../../../assets/placeholder.png");
    
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <CatAvatar 
                photoURL={photoURL}
                size={200}
                variant="headlineLarge"
                name={name}
            />
            <PillButton
                label="Select Cat"
                onPress={() => {navigation.navigate("SelectCat")}}
                />
            <Text style={{ marginHorizontal: 100, paddingVertical: 20, textAlign: "center" }}>
                Please ensure you have selected the right cat before proceeding</Text>
            <PillButton
                disabled={!catID}
                label="Continue to Update"
                onPress={() => {navigation.navigate("UpdateOptions", 
                    { ...cat })}}
            />

            <PillButton
                label="Create New Profile"
                onPress={() => navigation.navigate("Form", 
                    { catID: 0, name: "New Cat", photoURLs: [require("../../../../assets/placeholder.png")], formType: "create" })}
            />

            <PillButton
                label="Report New Cat"
                onPress={() => navigation.navigate("Form", 
                    { catID: 0, name: "New Cat", photoURLs: [require("../../../../assets/placeholder.png")], formType: "report" })}
            />
        </View>
    );
}
