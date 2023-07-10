import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getUsersWithNoti } from "./db/user";

// Send notifications
// @param notiType: "missing", "injured", "fed", "new"
// @param catID: catID to get name
export const sendNoti = async (notiType, catID) => {
    // Get name of cat
    const catDoc = await getDoc(doc(db, "Cat", catID));
    const catName = catDoc.data().name;

    // Get users' pushtokens based on their notification settings and cats followed
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

    // Send notifications to push tokens
    if (userPushTokens) {
        console.log(userPushTokens);
        const requestArray = userPushTokens.map((pushToken) => {
            return {
                to: pushToken,
                ...message,
            };
        });

        const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestArray),
        });

        // The code below is to get push tickets to see if notifications work
        // const tix = await response.json();
        // const ids = { ids: tix.data.map((ticket) => ticket.id) };

        // await fetch("https://exp.host/--/api/v2/push/getReceipts", {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Accept-encoding": "gzip, deflate",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(ids),
        // })
        //     .then((response) => response.text())
        //     .then((text) => console.log(text));
    }
};
