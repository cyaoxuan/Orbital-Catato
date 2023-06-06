import { Stack } from "expo-router";
import { AuthProvider } from "../../../utils/context/auth"

export default function CatalogueLayout() {
    return (
        <AuthProvider>
            <Stack initialRouteName="Catalogue" />
        </AuthProvider>
    );
}