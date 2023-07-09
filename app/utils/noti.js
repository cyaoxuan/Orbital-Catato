import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getUsersWithNoti } from "./db/user";

export const sendNoti = async (notiType, catID) => {
    const catDoc = await getDoc(doc(db, "Cat", catID));
    const catName = catDoc.data().name;

    const notiQuery =
        notiType === "fed" || notiType === "new" ? notiType : "concern";
    const userPushTokens = await getUsersWithNoti(notiQuery, catID);

    // Set message for different noti types
    let message = {
        sound: "default",
    };

    if (notiType === "new") {
        message = {
            ...message,
            title: "New Cat",
            body: "New Cat sighted recently!",
        };
    } else if (notiType === "missing") {
        message = {
            ...message,
            title: "Missing Cat",
            body: `${catName} has not been seen in more than 3 days!`,
        };
    } else if (notiType === "injured") {
        message = {
            ...message,
            title: "Missing Cat",
            body: `${catName} is reported as injured!`,
        };
    } else if (notiType === "fed") {
        message = {
            ...message,
            title: "Missing Cat",
            body: `${catName} has not been fed in more than 12 hours!`,
        };
    }

    // Send notis
    if (userPushTokens) {
        console.log(userPushTokens);
        const requestArray = [
            "ExponentPushToken[29h55pB8-weC0z5qgxehC1]",
            "ExponentPushToken[L41WWMDGdCC2HPxvSQWcdS]",
        ].map((pushToken) => {
            return {
                to: pushToken,
                ...message,
            };
        });

        await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestArray),
        });
    }
};
