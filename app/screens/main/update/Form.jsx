import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { CatAvatar } from "../../../components/CatAvatar";
import { PillButton } from "../../../components/Button";
import { cats } from "../../../data/CatTempData";
import { SelectList } from "react-native-dropdown-select-list";

export function CreateProfile({cat}) {
    return (
        <ScrollView>
            <Text>Create Profile</Text>
        </ScrollView>
    );
}

export function UpdateLocation({cat}) {
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
            <Text>Update Location for {cat.name}</Text>
            <SelectList
                setSelected={(val) => setSelected(val)}
                data={data}
                save="value"
                defaultOption={{ key: "1", value: "Use Current Location" }}
            />
        </View>
    );
}

export function UpdateConcern({cat}) {
    return (
        <View>
            <Text>Update Concern for {cat.name}</Text>
        </View>
    );
}

export function UpdateFed({cat}) {
    return (
        <View>
            <Text>Update Fed for {cat.name}</Text>
        </View>
    );
}

export function UpdateFoster({cat}) {
    return (
        <View>
            <Text>Temporarily Foster {cat.name}</Text>
        </View>
    );
}

export function UpdateProfile({cat}) {
    return (
        <View>
            <Text>Update Profile for {cat.name}</Text>
        </View>
    );
}

export function DeleteProfile({cat}) {
    return (
        <View>
            <Text>Delete Profile for {cat.name}</Text>
        </View>
    );
}

export default function Form() {
    const navigation = useNavigation();

    const route = useRoute();
    const formType = route.params.formType;
    const cat = cats.find((cat) => cat.catID === route.params.catID);
    

    let form;
    
    switch(formType) {
        case "create":
            form = <CreateProfile cat={cat} />
            break;
        case "location":
            form = <UpdateLocation cat={cat} />
            break;
        case "concern":
            form = <UpdateConcern cat={cat} />
            break;
        case "fed":
            form = <UpdateFed cat={cat} />
            break;
        case "foster":
            form = <UpdateFoster cat={cat} />
            break;
        case "update":
            form = <UpdateProfile cat={cat} />
            break;
        case "delete":
            form = <DeleteProfile cat={cat} />
            break;                       
    }
    
    return (
        <ScrollView contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <CatAvatar 
                photoURL={ cat
                    ? cat.photoURL
                    : require("../../../../assets/placeholder.png")}
                size={200}
                variant="headlineLarge"
                name={ cat
                    ? cat.name
                    : "Select Cat" }
            />

            { form }

            <PillButton mode="outlined"
                width="60%"
                label={formType === "delete"
                    ? "Remove"
                    : "Update"}
                onPress={() => {navigation.navigate("ConfirmUpdate", 
                    { name: cat.name, photoURL: cat.photoURL, formType: formType })}}
                />
         </ScrollView>
    )
    
}
