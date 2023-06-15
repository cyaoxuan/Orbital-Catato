import { useState } from "react";
import { FlatList, Image, View } from "react-native";
import { FAB, Portal, Provider, Text } from "react-native-paper";
import { Stack } from "expo-router";
import { getItemWidth }  from "../../../utils/CalculateDimensions";
import { useRoute } from "@react-navigation/native";

export default function PhotoGallery() {
    const [open, setOpen] = useState(false);

    const route = useRoute();
    const imageSize = getItemWidth(2, 8);

    return (
        <Provider>
            <View>
                <Stack.Screen options={{ title: "Photo Gallery"}} />
                <FlatList
                    ListHeaderComponent={() => <Text variant="headlineMedium">{route.params.name} Meowmories</Text>}
                    ListHeaderComponentStyle={{ alignItems: "center" }}
                    numColumns={2}
                    contentContainerStyle={{ justifyContent: "space-around" }}
                    data={route.params.photoURLs}
                    renderItem={({item, index}) => {
                        return (
                            <View key={index}>
                                <Image style={{ height: imageSize, width: imageSize, resizeMode: "cover", margin: 8 }} 
                                source={item} />
                            </View>
                        );
                    }}
                />
                <Portal>
                    <FAB.Group style={{ position: "absolute", bottom: 10, right: 10 }}
                        open={open}
                        icon={"plus"}
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