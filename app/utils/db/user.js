import { db } from "../../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/* ----- CREATE OPERATIONS ----- */
export const createUser = async (userID, isGuestUser) => {
    await setDoc(doc(db, "User", userID), {
        isGuest: true,
        isUser: !isGuestUser,
        isCaretaker: false,
        isAdmin: false,
    });
};

/* ----- READ OPERATIONS ----- */
export const getUser = async (userID) => {
    return (await getDoc(doc(db, "User", userID))).data();
};

/* ----- UPDATE OPERATIONS ----- */
// export const updateUser = async (userID, updateFields) => {
//     await update(ref(db, "User/" + userID), updateFields);
// }

/* ----- DELETE OPERATIONS ----- */
