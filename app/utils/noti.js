import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getUsersWithNoti } from "./db/user";

export const sendNoti = async (notiType, catID) => {
    const catDoc = await getDoc(doc(db, "Cat", catID));
    const catName = catDoc.data().name;

    const userPushTokens = await getUsersWithNoti(notiType, catID);

    // send noti
};
