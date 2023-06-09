import { db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";

export const createUser = async (userID, isGuest) => {
    await setDoc(doc(db, "User", userID), {
        isGuest: true,
        isUser: !isGuest,
        isCaretaker: false,
        isAdmin: false,
    });
};

// export const updateUser = async (userID, updateFields) => {
//     await update(ref(db, "User/" + userID), updateFields);
// }
