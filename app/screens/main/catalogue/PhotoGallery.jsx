import { useState } from "react";
import { FlatList, Image, View } from "react-native";
import { FAB, Portal, Provider, Text } from "react-native-paper";
import { getItemWidth }  from "../../../utils/calculateItemWidths";
import { useRoute } from "@react-navigation/native";

export default function PhotoGallery() {
    const [open, setOpen] = useState(false);

    const route = useRoute();
    const imageSize = getItemWidth(2, 8);

    return (
        <Provider>
            <View>
                <FlatList
                    ListHeaderComponent={() => <Text variant="headlineMedium">{route.params.name} Meowmories</Text>}
                    ListHeaderComponentStyle={{ alignItems: "center" }}
                    numColumns={2}
                    contentContainerStyle={{ justifyContent: "space-around" }}
                    data={route.params.photoURLs}
                    renderItem={({item, index}) => {
                        return (
                            <View key={index} testID="gallery-photo">
                                <Image style={{ height: imageSize, width: imageSize, resizeMode: "cover", margin: 8 }} 
                                source={item} />
                            </View>
                        );
                    }}
                />
                <Portal>
                    <FAB.Group testID="fab-group" 
                        style={{ position: "absolute", bottom: 10, right: 10 }}
                        open={open}
                        icon={open ? "close" : "plus"}
                        actions={[
                            {icon: "camera", label: "Camera", onPress: () => {}},
                            {icon: "image", label: "Gallery", onPress: () => {}}
                        ]}
                        onStateChange={() => setOpen((prev) => !prev)}
                    />
                </Portal>
            </View>
        </Provider>
    )
}