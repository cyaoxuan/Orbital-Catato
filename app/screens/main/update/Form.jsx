import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import { PillButton } from "../../../components/Button";
import { SelectList } from "react-native-dropdown-select-list";

export function CreateProfile({catID}) {
    return (
        <ScrollView>
            <Text>Create Profile</Text>
        </ScrollView>
    );
}

export function UpdateLocation({catID}) {
    const [selected, setSelected] = useState("");

    const data = [
        {key: "1", value: "Use Current Location"},
        {key: "2", value: "Utown"},
        {key: "3", value: "Engineering"},
        {key: "4", value: "Science"},
        {key: "5", value: "BizCom"},
        {key: "6", value: "Arts"},
    ]

    return (
        <View style={{width: "80%"}}>
            <Text>Update Location for {catID}</Text>
            <SelectList
                setSelected={(val) => setSelected(val)}
                data={data}
                save="value"
                defaultOption={{ key: "1", value: "Use Current Location" }}
            />
        </View>
    );
}

export function UpdateConcern({catID}) {
    return (
        <View>
            <Text>Update Concern for {catID}</Text>
        </View>
    );
}

export function UpdateFed({catID}) {
    return (
        <View>
            <Text>Update Fed for {catID}</Text>
        </View>
    );
}

export function UpdateFoster({catID}) {
    return (
        <View>
            <Text>Temporarily Foster {catID} </Text>
        </View>
    );
}

export function UpdateProfile({catID}) {
    return (
        <View>
            <Text>Update Profile for {catID}</Text>
        </View>
    );
}

export function DeleteProfile({catID}) {
    return (
        <View>
            <Text>Delete Profile for {catID}</Text>
        </View>
    );
}

function getForm(formType, catID) {
    switch(formType) {
        case "create":
            return <CreateProfile catID={catID}/>;
        case "location":
            return <UpdateLocation catID={catID} />;
        case "concern":
            return <UpdateConcern catID={catID} />;
        case "fed":
            return <UpdateFed catID={catID} />;
        case "foster":
            return <UpdateFoster catID={catID} />
        case "update":
            return <UpdateProfile catID={catID} />
        case "delete":
            return <DeleteProfile catID={catID} />
        default:
            return (
                <View>
                    <Text>Form not found!</Text>
                </View>
            )                  
    }
}

export default function Form() {
    const navigation = useNavigation();

    const route = useRoute();
    const formType = route.params.formType;
    const catID = route.params?.catID ? route.params.catID : null;
    const name = route.params.name;
    const photoURL = route.params.photoURL;
    
    return (
        <ScrollView contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <CatAvatar 
                photoURL={ photoURL }
                size={200}
                variant="headlineLarge"
                name={ name }
            />

            { getForm(formType, route.params.catID) }

            <PillButton mode="outlined"
                width="60%"
                label={formType === "delete"
                    ? "Remove"
                    : "Update"}
                onPress={() => {navigation.navigate("ConfirmUpdate", 
                    { name: name, photoURL: photoURL, formType: formType })}}
                />
         </ScrollView>
    )
    
}
