import { Dimensions, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from "../../utils/context/auth";
import { Carousel } from "../../components/CardCarousel";
import { cats } from "../../data/CatTempData"
import { getCatsOfConcern, getUnfedCats } from "../../utils/db/cat";

// Filter cat data
const concernCats = cats.filter(cat => cat.concernStatus && cat.concernStatus.length != 0);
const unfedCats = cats.filter(cat => {
    let today = new Date(2023, 5, 20, 13, 12, 0, 0);
    return cat.lastFedTime && ((today - cat.lastFedTime) / 3600000 > 12);
}) // Will eventually use Date.now()


// Calculate card width based on phone screen dimensions
function getCardWidth() {
    const {height, width} = Dimensions.get("window");
    // Card is 3/4 the width of a screen - margins
    const cardWidth = (width - (8 * 2)) / 4 * 3;
    return cardWidth;
}

const CarouselContainer = ({ titleText, subtitleText, ...carousel }) => {
    return (
        <View>
            <Text variant="headlineMedium">{titleText}</Text>
            <Text variant="headlineSmall">{subtitleText}</Text>
            <Carousel {...carousel} />
        </View>
    );
}


export default function Dashboard() {
    const { user } = useAuth();

    return (
        <ScrollView>
            <CarouselContainer 
                titleText="Cats of Concern"
                subtitleText="New, Injured, Missing for 3 Days"
                carouselType="concern"
                cats={concernCats}
                cardWidth={getCardWidth()}
                iconName1="information-circle"
                field1="Status: "
                iconName2="location"
                field2="Last Seen: "
            />

            <CarouselContainer 
                titleText="Unfed Cats"
                subtitleText="Not Fed in 12 Hours"
                carouselType="unfed"
                cats={unfedCats}
                cardWidth={getCardWidth()}
                iconName1="time"
                field1="Last Fed: "
                iconName2="location"
                field2="Last Seen: "
            />
        </ScrollView>
    );
}