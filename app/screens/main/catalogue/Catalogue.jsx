import { FlatList, View } from "react-native";
import { ActivityIndicator, SegmentedButtons, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { TouchableCatAvatar } from "../../../components/CatAvatar";
import { useEffect, useState } from "react";
import { useGetAllCats } from "../../../utils/db/cat";
import { useGetUserByID } from "../../../utils/db/user";
import { useAuth } from "../../../utils/context/auth";
import { useIsFocused } from "@react-navigation/native";

export default function Catalogue() {
    const { user, userRole } = useAuth();
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const { getAllCats, allCats, loading, error } = useGetAllCats();

    // For filter buttons (all/followed)
    const [filterValue, setFilterValue] = useState("");
    const [displayCats, setDisplayCats] = useState([]);
    const onFilter = (value) => {
        setFilterValue(value);
        if (value === "Followed") {
            let filteredCats = allCats.filter((cat) =>
                userDB.catsFollowed?.includes(cat.catID)
            );
            setDisplayCats(filteredCats);
        } else {
            let filteredCats = [...allCats];
            setDisplayCats(filteredCats);
        }
    };

    // Get user
    const { getUserByID, user: userDB } = useGetUserByID();
    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                await getUserByID(user.uid);
            };

            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isFocused]);

    // Get all cats
    useEffect(() => {
        const fetchData = async () => {
            await getAllCats();
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    // Set display cats on DB call
    useEffect(() => {
        if (allCats && userDB && filterValue === "Followed") {
            setDisplayCats([
                ...allCats.filter(
                    (cat) =>
                        cat.name && userDB.catsFollowed?.includes(cat.catID)
                ),
            ]);
        } else if (allCats) {
            setDisplayCats([...allCats.filter((cat) => cat.name)]);
        }
    }, [allCats, filterValue, userDB]);

    if (!user || !userRole) {
        return <ActivityIndicator />;
    }

    return (
        <FlatList
            testID="catalogue"
            contentContainerStyle={{ width: "100%" }}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            ListHeaderComponent={
                <View style={{ alignItems: "center", marginBottom: 16 }}>
                    <Text
                        variant="headlineLarge"
                        style={{ textAlign: "center", margin: 8 }}
                    >
                        Meet the Cats!
                    </Text>
                    {userRole.isUser && (
                        <SegmentedButtons
                            style={{ width: "70%" }}
                            value={filterValue}
                            onValueChange={onFilter}
                            disabled={!userDB}
                            buttons={[
                                {
                                    value: "All",
                                    label: "All",
                                },
                                {
                                    value: "Followed",
                                    label: "Followed",
                                },
                            ]}
                        />
                    )}

                    {error[0] && <Text>Error: {error[0].message}</Text>}
                    {loading[0] && <ActivityIndicator />}
                </View>
            }
            data={displayCats}
            renderItem={({ item }) => {
                return (
                    <TouchableCatAvatar
                        size={200}
                        photoURL={item.photoURLs ? item.photoURLs[0] : null}
                        variant="headlineLarge"
                        name={item.name}
                        onPress={() => {
                            navigation.navigate("CatProfile", {
                                catID: item.catID,
                            });
                        }}
                    />
                );
            }}
        />
    );
}
