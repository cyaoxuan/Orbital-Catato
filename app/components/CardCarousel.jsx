import { View, FlatList } from "react-native";
import { CatCard } from "../components/CatCard";
import { cats } from "../data/CatTempData";

// Filter cat data
const concernCats = cats.filter(cat => cat.concernStatus.length != 0);
const unfedCats = cats.filter(cat => {
    let today = new Date(2023, 5, 20, 13, 12, 0, 0);
    return (today - cat.lastFedTime) / 3600000 > 12;
}) // Will eventually use Date.now()

const boxWidth = 300;

const Carousel = (props) => {
    return (
        <FlatList style={{ height: 300 }}
                horizontal
                snapToAlignment="center"
                decelerationRate="normal"
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={10}
                snapToInterval={boxWidth}
                contentOffset={{ x: -120, y: 0 }}
                ItemSeparatorComponent={() => <View style={{width: 20}} />}
                
                data={props.carouselType === "concern" 
                ? concernCats
                : unfedCats}
                renderItem={({item, index}) => {
                    return (
                        <View key={index}> 
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

export { Carousel }