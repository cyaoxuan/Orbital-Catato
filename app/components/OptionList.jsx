import { StyleSheet } from "react-native";
import { Divider, List, Switch }  from "react-native-paper";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const SettingsOptionList = (props) => {
    const [valueNotif, setValueNotif] = useState(false);

    return (
        <List.Section>
            <List.Item  
                title="Reset Password"
                titleStyle={styles.title}
                onPress={() => {}}
                left={() => <List.Icon icon={() => <Ionicons name="lock-closed" size={24} />} />}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="FAQs"
                titleStyle={styles.title}
                onPress={() => {}}
                left={() => <List.Icon icon={() => <Ionicons name="help-circle" size={24} />} />}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                bottomDivider
                title="Notifications"
                titleStyle={styles.title}
                left={() => <List.Icon icon={() => <Ionicons name="notifications" size={24} />} />}
                right={() => <Switch style={{ transform:[{ scaleX: 1.5 }, { scaleY: 1.5 }] }} 
                    value={valueNotif} 
                    onValueChange={setValueNotif} 
                />}
            />
            <Divider />
            <List.Item 
                title="Documentation"
                titleStyle={styles.title}
                onPress={() => {}}
                left={() => <List.Icon icon={() => <Ionicons name="paper-plane" size={24} />} />}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
        </List.Section>
    )
}

const UpdateOptionsList = (props) => {
    return (
        <List.Section>
            <List.Item  
                title="Update Location"
                titleStyle={styles.title}
                onPress={() => {}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="Update Concern"
                titleStyle={styles.title}
                onPress={() => {}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                bottomDivider
                title="Update Fed Status"
                titleStyle={styles.title}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="Temporarily Foster"
                titleStyle={styles.title}
                onPress={() => {}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="Update Profile"
                titleStyle={styles.title}
                onPress={() => {}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
            <List.Item 
                title="Remove Cat Profile"
                titleStyle={styles.title}
                onPress={() => {}}
                right={() => <List.Icon icon="arrow-right" />}
            />
            <Divider />
        </List.Section>
    )
}

export { SettingsOptionList, UpdateOptionsList }

const styles = StyleSheet.create({
    title: {
        fontSize: 24
    }
})