import { db } from "../../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/* ----- CREATE OPERATIONS ----- */
export const createUser = async (userID, isGuestUser) => {
    try {
        await setDoc(doc(db, "User", userID), {
            userID: userID,
            role: {
                isGuest: true,
                isUser: !isGuestUser,
                isCaretaker: false,
                isAdmin: false,
            },
            notiOn: false,
            notiType: null,
            catsFollowed: null,
        });
    } catch (error) {
        console.error("Error creating user:", error);
    }
};

/* ----- READ OPERATIONS ----- */
export const getUser = async (userID) => {
    try {
        const user = await getDoc(doc(db, "User", userID));
        return user.exists() ? user.data() : null;
    } catch (error) {
        console.error("Error getting user:", error);
    }
};

/* ----- UPDATE OPERATIONS ----- */
// export const updateUser = async (userID, updateFields) => {
//     await update(ref(db, "User/" + userID), updateFields);
// }

/* ----- DELETE OPERATIONS ----- */
