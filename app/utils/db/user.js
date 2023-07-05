import { useState } from "react";
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
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";

const userColl = collection(db, "User");
const userUpdateColl = collection(db, "UserUpdate");

// Note: Some functions are not exported as they are only used for testing / internal calls.
// This is to ensure that all changes to the database is logged for accountability.
/* ----- CREATE OPERATIONS ----- */
// Note: Guests are not stored in Firestore
// Only used in AuthProvider
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
// Only used in AuthProvider
export const getUserByID = async (userID) => {
    try {
        const user = await getDoc(doc(db, "User", userID));
        return user.exists() ? user.data() : null;
    } catch (error) {
        console.error("Error getting user:", error);
    }
};

export const useGetUserByEmail = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const getUserByEmail = async (email) => {
        try {
            setLoading([true]);
            setError([null]);

            const q = query(userColl, where("email", "==", email), limit(1));
            const querySnapshot = await getDocs(q);
            const userData =
                querySnapshot.docs.length === 1
                    ? querySnapshot.docs[0].data()
                    : null;
            setUser(userData);
        } catch (error) {
            console.error("Error getting user by email:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { getUserByEmail, user, loading, error };
};

/* ----- UPDATE OPERATIONS ----- */
const updateUser = async (userID, updateFields) => {
    await updateDoc(doc(db, "User", userID), updateFields);
};

export const useUpdateUserRole = () => {
    //
};

export const useUpdateUserNotification = () => {
    //
};

export const useUserFollowCat = () => {
    //
};

export const useUserUnfollowCat = () => {
    //
};

/* ----- DELETE OPERATIONS ----- */
