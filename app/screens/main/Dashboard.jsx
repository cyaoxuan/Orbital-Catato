import { FlatList, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from "../../context/auth";
import { CatCard } from "../../components/CatCard";
import { cats } from "../../data/CatTempData";

// Filter cat data
const concernCats = cats.filter(cat => cat.concernStatus && cat.concernStatus.length != 0);
const unfedCats = cats.filter(cat => {
    let today = new Date(2023, 5, 20, 13, 12, 0, 0);
    return cat.lastFedTime && ((today - cat.lastFedTime) / 3600000 > 12);
}) // Will eventually use Date.now()

const boxWidth = 300;

const Carousel = (props) => {
    return (
        <FlatList style={{ height: 300 }}
                horizontal
                snapToAlignment="center"
                decelerationRate="normal"
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={4}
                snapToInterval={boxWidth}
                ItemSeparatorComponent={() => <View style={{width: 20}} />}
                
                data={props.carouselType === "concern" 
                    ? concernCats
                    : unfedCats}
                renderItem={({item}) => {
                    return (
                        <View key={item.catID}> 
                            <CatCard cat={item}
                                cardType={props.carouselType}
                                iconName1={props.iconName1}
                                field1={props.field1}
                                iconName2={props.iconName2}
                                field2={props.field2}
                            />
                        </View>
                        
                    );
                }}
        />
    );
};

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
