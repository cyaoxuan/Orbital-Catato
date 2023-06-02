import { ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from "../../context/auth";
import { Carousel } from "../../components/CardCarousel";



export default function Dashboard() {
    const { user } = useAuth();

    return (
        <ScrollView>
            <Text variant="headlineMedium">Cats of Concern</Text>
            <Text variant="headlineSmall">New, Injured, Missing for 3 Days</Text>
            <Carousel carouselType="concern"
                iconName1="information-circle"
                field1="Status: "
                iconName2="location"
                field2="Last Seen: " />

            <Text variant="headlineMedium">Unfed Cats</Text>
            <Text variant="headlineSmall">Not Fed in 12 Hours</Text>
            <Carousel carouselType="unfed"
                iconName1="time"
                field1="Last Fed: "
                iconName2="location"
                field2="Last Seen: " />
        </ScrollView>
    );
}
