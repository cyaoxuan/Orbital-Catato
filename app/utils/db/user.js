import { db } from "../../config/firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";

const userColl = collection(db, "User");
const userUpdateColl = collection(db, "UserUpdate");

/* ----- CREATE OPERATIONS ----- */
// Note: Guests are not stored in Firestore
export const createUser = async (userID, email) => {
    try {
        await setDoc(doc(db, "User", userID), {
            userID: userID,
            email: email,
            role: {
                // Note: If user is caretaker, isGuest and isUser will also be true
                isGuest: true,
                isUser: true,
                isCaretaker: false,
                isAdmin: false,
            },
            notiOn: false,
            notiType: null,
            catsFollowed: null,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error creating user:", error);
    }
};

/* ----- READ OPERATIONS ----- */
// Returns null if user doesn't exist
export const getUserByID = async (userID) => {
    try {
        const user = await getDoc(doc(db, "User", userID));
        return user.exists() ? user.data() : null;
    } catch (error) {
        console.error("Error getting user:", error);
    }
};

export const getUserByEmail = async (email) => {
    try {
        const q = query(userColl, where("email", "==", email), limit(1));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.length === 1
            ? querySnapshot.docs[0].data()
            : null;
    } catch (error) {
        console.error("Error getting user by email:", error);
    }
};

/* ----- UPDATE OPERATIONS ----- */
// export const updateUser = async (userID, updateFields) => {
//     await update(ref(db, "User/" + userID), updateFields);
// }

/* ----- DELETE OPERATIONS ----- */
