import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import { PillButton } from "../../../components/Button";
import * as FormTypes from "./FormType"

function getForm(formType, catID) {
    switch(formType) {
        case "create":
            return <FormTypes.CreateProfile catID={catID} />;
        case "location":
            return <FormTypes.UpdateLocation catID={catID} />;
        case "concern":
            return <FormTypes.UpdateConcern catID={catID} />;
        case "fed":
            return <FormTypes.UpdateFed catID={catID} />;
        case "foster":
            return <FormTypes.UpdateFoster catID={catID} />
        case "update":
            return <FormTypes.UpdateProfile catID={catID} />
        case "delete":
            return <FormTypes.DeleteProfile catID={catID} />
        default:
            return (
                <View>
                    <Text>Form not found!</Text>
                </View>
            )                  
    }
}

export default function Form() {
    const navigation = useNavigation();

    const route = useRoute();
    const formType = route.params.formType;
    const catID = route.params?.catID ? route.params.catID : null;
    const name = route.params.name;
    const photoURL = route.params.photoURL;
    
    return (
        <ScrollView contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <CatAvatar 
                photoURL={ photoURL }
                size={200}
                variant="headlineLarge"
                name={ name }
            />

            { getForm(formType, catID) }

            <PillButton mode="outlined"
                width="60%"
                label={formType === "delete"
                    ? "Remove"
                    : "Update"}
                onPress={() => {navigation.navigate("ConfirmUpdate", 
                    { name: name, photoURL: photoURL, formType: formType })}}
                />
         </ScrollView>
    )
    
}
