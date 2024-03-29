import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { ActivityIndicator, DefaultTheme, Provider } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import * as FormTypes from "./FormType";
import { useAuth } from "../../../utils/context/auth";
import { Platform } from "react-native";
import { BodyText } from "../../../components/Text";
import { screenMainColor, secondaryColor } from "../../../components/Styles";

// Checks which formtype and returns the relevant form
// @param userID: userID to pass it to form
// @param params: params from form needed for the form types
function getForm(userID, params) {
    switch (params.formType) {
        case "create":
            return <FormTypes.CreateProfile userID={userID} {...params} />;
        case "report":
            return <FormTypes.ReportCat userID={userID} {...params} />;
        case "location":
            return <FormTypes.UpdateLocation userID={userID} {...params} />;
        case "concern":
            return <FormTypes.UpdateConcern userID={userID} {...params} />;
        case "fed":
            return <FormTypes.UpdateFed userID={userID} {...params} />;
        case "update":
            return <FormTypes.UpdateProfile userID={userID} {...params} />;
        case "delete":
            return <FormTypes.DeleteProfile userID={userID} {...params} />;
        default:
            return (
                <View>
                    <BodyText variant="bodyMedium" text="Form not found!" />
                </View>
            );
    }
}

export default function Form() {
    const { user } = useAuth();
    const route = useRoute();

    if (!user) {
        return <ActivityIndicator color={secondaryColor} />;
    }

    return (
        <Provider theme={lightTheme}>
            {/* keyboard avoiding to prevent blocking of form inputs */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : ""}
                style={{ flex: 1, backgroundColor: screenMainColor }}
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    contentContainerStyle={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CatAvatar
                        photoURL={
                            route.params.photoURLs
                                ? route.params.photoURLs[0]
                                : null
                        }
                        size={200}
                        variant="headlineLarge"
                        name={route.params.name}
                    />
                    {getForm(user.uid, route.params)}
                    <View style={{ height: 20 }}></View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Provider>
    );
}

const lightTheme = {
    ...DefaultTheme,
    mode: "light",
    dark: false,
};
