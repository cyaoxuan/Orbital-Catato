import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { concernCatCards } from "../../components/CatCardData";
import { TouchableCatAvatar } from "../../components/CatAvatar";

export default function Catalogue() {
    return (
        <FlatList style={{ alignContent: "center" }}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            ListHeaderComponent={<Text variant="headlineLarge">Meet the Cats!</Text>}
            
            data={concernCatCards}
            renderItem={({item, index}) => {
                return (
                    <TouchableCatAvatar size={200}
                        image={item.catImage}
                        variant="headlineLarge"
                        text={item.catName}
                    />
                )
            }}
        />
    );
}