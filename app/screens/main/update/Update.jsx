import { View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import { PillButton } from "../../../components/Button";
import { cats } from "../../../data/CatTempData";

export default function Update() {
    const navigation = useNavigation();
    
    const route = useRoute();
    const cat = route.params?.catID
        ? cats.find((cat) => cat.catID === route.params.catID)
        : null;
    
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <CatAvatar 
                photoURL={ cat
                    ? cat.photoURL
                    : require("../../../../assets/placeholder.png")}
                size={200}
                variant="headlineLarge"
                name={ cat
                    ? cat.name
                    : "Select Cat" }
            />
            <PillButton mode="outlined"
                width="60%"
                label="Select Cat"
                onPress={() => {navigation.navigate("SelectCat")}}
                />
            <Text style={{ marginHorizontal: 100, paddingVertical: 20, textAlign: "center" }}>
                Please ensure you have selected the right cat before proceeding</Text>
            <PillButton mode="outlined"
                disabled={ !cat }
                width="60%"
                label="Continue to Update"
                onPress={() => {navigation.navigate("UpdateOptions", 
                    { catID: cat.catID, name: cat.name, photoURL: cat.photoURL })}} // send param of current cat, send back to prev page unless proceed
            />
        </View>
    );
}
