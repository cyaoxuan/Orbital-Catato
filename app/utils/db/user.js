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
            notiType: {
                new: false,
                concern: false,
                fed: false,
            },
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
export const authGetUserByID = async (userID) => {
    try {
        // console.log("getUserByID, user: 1");
        const user = await getDoc(doc(db, "User", userID));
        return user.exists() ? user.data() : null;
    } catch (error) {
        console.error("Error getting user:", error);
    }
};

export const useGetUserByID = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const getUserByID = async (userID) => {
        try {
            setLoading([true]);
            setError([null]);

            // console.log("getUserByID, user: 1");
            const user = await getDoc(doc(db, "User", userID));
            const userData = user.exists() ? user.data() : null;
            setUser(userData);
        } catch (error) {
            console.error("Error getting user by ID:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { getUserByID, user, loading, error };
};

export const useGetUserByEmail = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const getUserByEmail = async (email) => {
        try {
            setLoading([true]);
            setError([null]);

            // console.log("getUserByEmail, user: 1");
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
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const updateUserRole = async (userID, newRole) => {
        try {
            if (!(userID && newRole)) {
                throw new Error("Empty fields detected");
            }
            setLoading([true]);
            setError([null]);

            await updateUser(userID, {
                role: {
                    isGuest: true,
                    isUser: true,
                    isCaretaker: newRole === "Caretaker" || newRole === "Admin",
                    isAdmin: newRole === "Admin",
                },
            });
        } catch (error) {
            console.error("Error updating user role:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { updateUserRole, loading, error };
};

export const useUpdateUserNotification = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const updateUserNotification = async (
        userID,
        allNotif,
        newNotif,
        concernNotif,
        fedNotif
    ) => {
        try {
            if (
                !(
                    userID &&
                    allNotif !== null &&
                    newNotif !== null &&
                    concernNotif !== null &&
                    fedNotif !== null
                )
            ) {
                throw new Error("Empty fields detected");
            }
            setLoading([true]);
            setError([null]);

            await updateUser(userID, {
                notiOn: allNotif,
                notiType: {
                    new: allNotif && newNotif,
                    concern: allNotif && concernNotif,
                    fed: allNotif && fedNotif,
                },
            });
        } catch (error) {
            console.error("Error updating user notifications:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { updateUserNotification, loading, error };
};

export const useUserToggleCatFollow = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const userToggleCatFollow = async (userID, catID, followed) => {
        try {
            if (!(userID && catID && followed !== null)) {
                throw new Error("Empty fields detected");
            }
            setLoading([true]);
            setError([null]);

            const user = await getDoc(doc(db, "User", userID));
            if (!user.exists()) {
                throw new Error("User does not exist");
            }

            // Change catsFollowed array
            const oldCatsFollowed = user.data().catsFollowed;

            if (followed) {
                // Append to array of cats followed
                await updateUser(userID, {
                    catsFollowed: oldCatsFollowed
                        ? [...oldCatsFollowed, catID]
                        : [catID],
                });
            } else {
                // Filter from array of cats followed
                const newCatsFollowed = oldCatsFollowed.filter(
                    (id) => id !== catID
                );
                await updateUser(userID, {
                    catsFollowed:
                        newCatsFollowed.length === 0 ? null : newCatsFollowed,
                });
            }
        } catch (error) {
            console.error("Error updating user's cats followed:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { userToggleCatFollow, loading, error };
};
