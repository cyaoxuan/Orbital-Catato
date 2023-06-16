import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import * as FormTypes from "./FormType"
import { useAuth } from "../../../utils/context/auth";

function getForm(userID, params) {
    switch(params.formType) {
        case "create":
            return <FormTypes.CreateProfile userID={userID} {...params} />;
        case "location":
            return <FormTypes.UpdateLocation userID={userID} {...params} />;
        case "concern":
            return <FormTypes.UpdateConcern userID={userID} {...params} />;
        case "fed":
            return <FormTypes.UpdateFed userID={userID} {...params} />;
        case "foster":
            return <FormTypes.UpdateFoster userID={userID} {...params} />
        case "update":
            return <FormTypes.UpdateProfile userID={userID} {...params} />
        case "delete":
            return <FormTypes.DeleteProfile userID={userID} {...params} />
        default:
            return (
                <View>
                    <Text>Form not found!</Text>
                </View>
            )                  
    }
}

export default function Form() {
    const { user } = useAuth();
    const route = useRoute();
    
    return (
        <ScrollView contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <CatAvatar 
                photoURL={ route.params.photoURL }
                size={200}
                variant="headlineLarge"
                name={ route.params.name }
            />

            { getForm(1, route.params) }

         </ScrollView>
    )
    
}
