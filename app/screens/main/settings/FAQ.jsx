import React from "react";
import {
    allStyles,
    screenMainColor,
    secondaryColor,
} from "../../../components/Styles";
import { ScrollView } from "react-native";
import { List } from "react-native-paper";
import { StyleSheet } from "react-native";
import { View } from "react-native";

const accordionTheme = {
    colors: {
        background: screenMainColor,
        primary: secondaryColor,
    },
};

export default function FAQ() {
    return (
        <ScrollView
            style={{
                backgroundColor: screenMainColor,
                height: "100%",
                padding: 16,
            }}
        >
            <List.Section
                title="Frequently Asked Questions"
                titleStyle={[allStyles.titleText, { fontSize: 18 }]}
            >
                <List.Accordion
                    theme={accordionTheme}
                    title="It seems like a cat is unfed. Can I feed it?"
                    titleStyle={[allStyles.bodyText, styles.accordionTitle]}
                >
                    <List.Item
                        title="Unless you are the appointed caretaker, please do not unnecessarily 
                        feed the cats! We assure that all cats with names shown are being looked after."
                        titleNumberOfLines={4}
                        titleStyle={[allStyles.bodyText, styles.itemTitle]}
                    />
                </List.Accordion>
                <List.Accordion
                    theme={accordionTheme}
                    title="How do I become a caretaker or admin?"
                    titleStyle={[allStyles.bodyText, styles.accordionTitle]}
                >
                    <List.Item
                        title="Admins are likely to be given to NUS Staff or NUS CatCafe EXCO. 
                    Caretakers are appointed by these admins to look after the community cats in NUS."
                        titleNumberOfLines={4}
                        titleStyle={[allStyles.bodyText, styles.itemTitle]}
                    />
                </List.Accordion>
                <List.Accordion
                    theme={accordionTheme}
                    title="Why are the cat locations so vague?"
                    titleStyle={[allStyles.bodyText, styles.accordionTitle]}
                >
                    <List.Item
                        title="For the safety of the cats, non-caretakers are not given precise locations. 
                    Instead, last seen zones are displayed and pins on the map page are randomised in these zones."
                        titleNumberOfLines={4}
                        titleStyle={[allStyles.bodyText, styles.itemTitle]}
                    />
                </List.Accordion>
            </List.Section>
            <View style={{ height: 30 }}></View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    accordionTitle: {
        fontSize: 14,
    },
    itemTitle: {
        fontSize: 14,
    },
});
