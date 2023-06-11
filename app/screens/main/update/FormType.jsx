import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { SelectList } from "react-native-dropdown-select-list";


const CreateProfile = ({catID}) => {
    return (
        <ScrollView>
            <Text>Create Profile</Text>
        </ScrollView>
    );
}

const UpdateLocation = ({catID}) => {
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

const UpdateConcern = ({catID}) => {
    return (
        <View>
            <Text>Update Concern for {catID}</Text>
        </View>
    );
}

const UpdateFed = ({catID}) => {
   return (
        <View>
            <Text>Update Fed for {catID}</Text>
        </View>
    );
}

const UpdateFoster = ({catID}) => {
    return (
        <View>
            <Text>Temporarily Foster {catID} </Text>
        </View>
    );
}

const UpdateProfile = ({catID}) => {
    return (
        <View>
            <Text>Update Profile for {catID}</Text>
        </View>
    );
}

const DeleteProfile = ({catID}) => {
    return (
        <View>
            <Text>Delete Profile for {catID}</Text>
        </View>
    );
}

export { CreateProfile, UpdateConcern, UpdateFed, 
    UpdateFoster, UpdateLocation, UpdateProfile, DeleteProfile };