import { ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from "../../context/auth";
import { concernCatCards, fedCatCards } from "../../components/CatTempData";
import { Carousel } from "../../components/CardCarousel";



export default function Dashboard() {
    const { user } = useAuth();

    return (
        <ScrollView>
            <Text variant="headlineMedium">Cats of Concern</Text>
            <Text variant="headlineSmall">New, Injured, Missing for 3 Days</Text>
            <Carousel cards={concernCatCards} />

            <Text variant="headlineMedium">Unfed Cats</Text>
            <Text variant="headlineSmall">Not Fed in 12 Hours</Text>
            <Carousel cards={fedCatCards} />
        </ScrollView>
    );
}
