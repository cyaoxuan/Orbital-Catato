import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import * as FormTypes from "./FormType"

function getForm(params) {
    switch(params.formType) {
        case "create":
            return <FormTypes.CreateProfile {...params} />;
        case "location":
            return <FormTypes.UpdateLocation {...params} />;
        case "concern":
            return <FormTypes.UpdateConcern {...params} />;
        case "fed":
            return <FormTypes.UpdateFed {...params} />;
        case "foster":
            return <FormTypes.UpdateFoster {...params} />
        case "update":
            return <FormTypes.UpdateProfile {...params} />
        case "delete":
            return <FormTypes.DeleteProfile {...params} />
        default:
            return (
                <View>
                    <Text>Form not found!</Text>
                </View>
            )                  
    }
}

export default function Form() {
    const route = useRoute();
    
    return (
        <ScrollView contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <CatAvatar 
                photoURL={ route.params.photoURL }
                size={200}
                variant="headlineLarge"
                name={ route.params.name }
            />

            { getForm(route.params) }

         </ScrollView>
    )
    
}
