import { ScrollView, View } from "react-native";
import React from "react";
import { screenMainColor } from "../../../components/Styles";
import { BodyText, TitleText } from "../../../components/Text";

export default function About() {
    return (
        <ScrollView
            style={{
                backgroundColor: screenMainColor,
                height: "100%",
                padding: 16,
            }}
        >
            <View style={{ marginVertical: 8 }}>
                <TitleText variant="headlineSmall" text="About CatAtO" />
                <BodyText
                    variant="bodyMedium"
                    text="CatAtO is a mobile application as a centralised platform for 
                the community and cat caretakers to facilitate information exchange and 
                updates about community cats, specifically those in NUS."
                />
            </View>

            <View style={{ marginVertical: 8 }}>
                <TitleText variant="headlineSmall" text="Motivation" />
                <BodyText
                    variant="bodyMedium"
                    text="It is designed to address the challenges faced by cat feeders and 
                caretakers in tracking and communicating about adventurous community cats, 
                particularly when they go missing or become injured. Additionally, 
                the app aims to prevent overfeeding by facilitating better communication among caregivers. 
                By harnessing the power of user-driven updates, we hope to enhance the 
                care and well-being of our precious kitties."
                />
            </View>

            <View style={{ marginVertical: 8 }}>
                <TitleText variant="headlineSmall" text="Team" />
                <BodyText
                    variant="bodyMedium"
                    text="We are a pair of NUS SoC students working on a mobile app called CatAtO 
                    under the module CP2106 Independent Software Development Project (Orbital). 
                    The inspiration for this project came from our love of cats."
                />
            </View>
        </ScrollView>
    );
}
