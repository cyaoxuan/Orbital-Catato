import { Stack } from "expo-router";
import { AuthProvider } from "../../../utils/context/auth";
import { screenSecondaryColor } from "../../../components/Styles";

export default function CatalogueLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Catalogue">
                <Stack.Screen
                    name="Catalogue"
                    options={{
                        title: "CATalogue",
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="CatProfile"
                    options={{
                        title: "Cat Profile",
                        headerTitleStyle: {
                            fontFamily: "Nunito-Bold",
                        },
                        elevation: 0,
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: screenSecondaryColor,
                        },
                    }}
                />
                <Stack.Screen
                    name="PhotoGallery"
                    options={{
                        title: "Photo Gallery",
                        headerTitleStyle: { fontFamily: "Nunito-Bold" },
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
            </Stack>
        </AuthProvider>
    );
}
