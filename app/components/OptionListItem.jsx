import { StyleSheet } from "react-native";
import { Divider, List, Switch } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

// Styled RN Paper List Item for options
// props: title (string), onPress (callback)
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
            <Divider />
        </>
    );
};

// Styled RN Paper List Item for options with icon
// props: title (string), onPress (callback), iconName (string)
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
            <Divider />
        </>
    );
};

// Styled RN Paper List Item for switches
// props: title (string), topView (boolean), bottomView (boolean),
// value (hook value), onValueChange (callback)
const SwitchListItem = (props) => {
    const viewStyle = [styles.listView];
    if (props.topView) viewStyle.push(styles.topListView);
    if (props.bottomView) viewStyle.push(styles.bottomListView);

    return (
        <List.Item
            title={props.title}
            style={viewStyle}
            titleStyle={styles.listTitle}
            right={() => (
                <Switch
                    style={{
                        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
                    }}
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
        fontSize: 20,
    },
    listView: {
        justifyContent: "center",
        height: 65,
    },
    topListView: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    bottomListView: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    userDetails: {
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
});
