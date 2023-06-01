import { Stack } from "expo-router";
import { AuthProvider } from "../../../context/auth"

export default function CatalogueLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Catalogue" />
        </AuthProvider>
    );
}