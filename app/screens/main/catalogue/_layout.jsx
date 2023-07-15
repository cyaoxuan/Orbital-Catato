import { Stack } from "expo-router";
import { AuthProvider } from "../../../utils/context/auth";
import { allStyles, screenSecondaryColor } from "../../../components/Styles";

export default function CatalogueLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Catalogue">
                <Stack.Screen
                    name="Catalogue"
                    options={{
                        title: "CATalogue",
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="CatProfile"
                    options={{
                        title: "Cat Profile",
                        headerTitleStyle: allStyles.titleText,
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
                        headerTitleStyle: allStyles.titleText,
                        elevation: 0,
                        headerShadowVisible: false,
                    }}
                />
            </Stack>
        </AuthProvider>
    );
}
