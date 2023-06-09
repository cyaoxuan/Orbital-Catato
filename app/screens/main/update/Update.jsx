import { View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import { PillButton } from "../../../components/Button";

export default function Update() {
    const navigation = useNavigation();
    
    const route = useRoute();
    const catID = route.params?.catID ? route.params.catID : null;
    const name = route.params?.name ? route.params.name : "Select Cat";
    const photoURL = route.params?.photoURL
        ? route.params.photoURL
        : require("../../../../assets/placeholder.png");
    
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <CatAvatar 
                photoURL={photoURL}
                size={200}
                variant="headlineLarge"
                name={name}
            />
            <PillButton mode="outlined"
                width="60%"
                label="Select Cat"
                onPress={() => {navigation.navigate("SelectCat")}}
                />
            <Text style={{ marginHorizontal: 100, paddingVertical: 20, textAlign: "center" }}>
                Please ensure you have selected the right cat before proceeding</Text>
            <PillButton mode="outlined"
                width="60%"
                label="New Cat"
                onPress={() => navigation.navigate("Form", 
                    { name: "New Cat", photoURL: require("../../../../assets/placeholder.png"), formType: "create" })}
            />
            <PillButton mode="outlined"
                disabled={!catID}
                width="60%"
                label="Continue to Update"
                onPress={() => {navigation.navigate("UpdateOptions", 
                    { catID: catID, name: name, photoURL: photoURL })}} // send param of current cat, send back to prev page unless proceed
            />
        </View>
    );
}
