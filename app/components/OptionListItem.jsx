import { StyleSheet } from "react-native";
import { Divider, List, Switch } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { secondaryColor } from "./Styles";

// Styled RN Paper List Item for options
// props: title (string), onPress (callback), divider (boolean)
const OptionListItem = (props) => {
    return (
        <>
            <List.Item
                title={props.title}
                style={styles.listView}
                titleStyle={styles.listTitle}
                onPress={props.onPress}
                right={() => (
                    <List.Icon
                        icon={() => (
                            <Ionicons name="chevron-forward" size={iconSize} />
                        )}
                    />
                )}
            />
            {props.divider && <Divider />}
        </>
    );
};

// Styled RN Paper List Item for options with icon
// props: title (string), onPress (callback), iconName (string), divider (boolean)
const OptionListItemIcon = (props) => {
    return (
        <>
            <List.Item
                title={props.title}
                style={styles.listView}
                titleStyle={styles.listTitle}
                onPress={props.onPress}
                left={() => (
                    <List.Icon
                        icon={() => (
                            <Ionicons name={props.iconName} size={iconSize} />
                        )}
                    />
                )}
                right={() => (
                    <List.Icon
                        icon={() => (
                            <Ionicons name="chevron-forward" size={iconSize} />
                        )}
                    />
                )}
            />
            {props.divider && <Divider />}
        </>
    );
};

// Styled RN Paper List Item for switches
// props: title (string), topView (boolean), bottomView (boolean),
// value (hook value), onValueChange (callback), divider (boolean)
const SwitchListItem = (props) => {
    return (
        <List.Item
            title={props.title}
            description={props.description}
            style={styles.listView}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
            right={() => (
                <Switch
                    style={styles.switch}
                    color={secondaryColor}
                    disabled={props.disabled}
                    value={props.value}
                    onValueChange={props.onValueChange}
                />
            )}
        />
    );
};

export { OptionListItem, OptionListItemIcon, SwitchListItem };

const iconSize = 20;

// Notis
const styles = StyleSheet.create({
    listTitle: {
        fontFamily: "Nunito-Medium",
        fontSize: 20,
    },
    listDescription: {
        fontFamily: "Nunito-Medium",
        fontSize: 12,
    },
    listView: {
        justifyContent: "center",
        height: 65,
        padding: 16,
        borderRadius: 16,
    },
    switch: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    },
    userDetails: {
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
});
