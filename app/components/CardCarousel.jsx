import { View, FlatList } from "react-native";
import { CatCard } from "../components/CatCard";

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
                
                data={props.cards}
                renderItem={({item, index}) => {
                    return (
                        <View key={index}> 
                            <CatCard 
                                catImage={item.catImage}
                                catName={item.catName}
                                iconName1={item.iconName1}
                                field1={item.field1}
                                info1={item.info1}
                                iconName2={item.iconName2}
                                field2={item.field2}
                                info2={item.info2}
                            />
                        </View>
                        
                    );
                }}
        />

    );
};

export { Carousel }