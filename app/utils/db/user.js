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
} from "firebase/firestore";

const userColl = collection(db, "User");

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
            notiOn: true,
            notiType: {
                concern: true,
                fed: false,
                new: true,
            },
            catsFollowed: null,
            pushTokens: null,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error creating user:", error);
    }
};

/* ----- READ OPERATIONS ----- */
// Returns null if user doesn't exist
// Only used in AuthProvider
export const authGetUserByID = async (userID, maxRetries = 3) => {
    let retryCount = 0;
    while (retryCount < maxRetries) {
        try {
            const user = await getDoc(doc(db, "User", userID));
            return user.exists() ? user.data() : null;
        } catch (error) {
            console.error("Error getting user:", error);
            retryCount++;
        }
    }
    return null;
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

// For notifications
export const getUsersWithNoti = async (notiType, catID) => {
    let q;
    if (notiType === "concern" || notiType === "fed") {
        // For notis that need catID (concern, fed)
        q = query(
            userColl,
            where("notiOn", "==", true),
            where("notiType." + notiType, "==", true),
            where("catsFollowed", "array-contains", catID)
        );
    } else if (notiType === "new") {
        // For notis that dont need cat id (new)
        q = query(
            userColl,
            where("notiOn", "==", true),
            where("notiType." + notiType, "==", true)
        );
    } else if (notiType === "announcement") {
        // Admin announcements
        q = query(userColl, where("notiOn", "==", true));
    }

    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs
        .flatMap((doc) => doc.data().pushTokens)
        .filter((token) => token);
    return users;
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
                    concern: allNotif && concernNotif,
                    fed: allNotif && fedNotif,
                    new: allNotif && newNotif,
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

// For notifications, errors handled in respective auth functions in screens
export const addUserPushToken = async (userID, pushToken) => {
    const user = await getDoc(doc(db, "User", userID));
    if (!user.exists()) {
        return;
    }

    const oldPushTokens = user.data().pushTokens;
    const newPushTokens = oldPushTokens
        ? [...oldPushTokens, pushToken]
        : [pushToken];
    await updateUser(userID, { pushTokens: newPushTokens });
};

export const removeUserPushToken = async (userID, pushToken) => {
    const user = await getDoc(doc(db, "User", userID));
    if (!user.exists()) {
        return;
    }

    const oldPushTokens = user.data().pushTokens;
    const filteredPushTokens = oldPushTokens
        ? oldPushTokens.filter((token) => token !== pushToken)
        : [];
    const newPushTokens =
        filteredPushTokens.length === 0 ? null : filteredPushTokens;
    await updateUser(userID, { pushTokens: newPushTokens });
};
