import { Stack } from "expo-router";
import { AuthProvider } from "../../../utils/context/auth";

export default function CatalogueLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Catalogue">
                <Stack.Screen name="Catalogue" />
                <Stack.Screen
                    name="CatProfile"
                    options={{ title: "Cat Profile" }}
                />
                <Stack.Screen
                    name="PhotoGallery"
                    options={{ title: "Photo Gallery" }}
                />
            </Stack>
        </AuthProvider>
    );
}
