import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useState } from "react";
import { sendNoti } from "../noti";

const announcementColl = collection(db, "Announcement");

/* ----- CREATE OPERATIONS ----- */
export const useCreateAnnouncement = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const createAnnouncement = async (message) => {
        try {
            setLoading([true]);
            setError([null]);

            await addDoc(announcementColl, {
                message: message,
                updatedAt: serverTimestamp(),
            });

            // sendNoti("announcement", null);
        } catch (error) {
            console.error("Error creating announcement:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { createAnnouncement, loading, error };
};

/* ----- READ OPERATIONS ----- */
export const useGetAnnouncements = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);
    const [announcements, setAnnouncements] = useState([]);

    const getAnnouncements = async () => {
        try {
            setLoading([true]);
            setError([null]);

            const querySnapshot = await getDocs(announcementColl);
            const announcementsData = querySnapshot.docs.map((doc) =>
                doc.data()
            );
            setAnnouncements(announcementsData);
        } catch (error) {
            console.error("Error getting announcements:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { announcements, getAnnouncements, loading, error };
};

/* ----- UPDATE OPERATIONS ----- */
export const useUpdateAnnouncement = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const updateAnnouncement = async (announcementID, newMessage) => {
        try {
            setLoading([true]);
            setError([null]);

            await setDoc(doc(db, "Announcement", announcementID), {
                message: newMessage,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error updating announcement:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { updateAnnouncement, loading, error };
};

/* ----- DELETE OPERATIONS ----- */
export const useDeleteAnnouncement = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const deleteAnnouncement = async (announcementID) => {
        try {
            setLoading([true]);
            setError([null]);

            await deleteDoc(doc(db, "Announcement", announcementID));
        } catch (error) {
            console.error("Error deleting announcement:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { deleteAnnouncement, loading, error };
};
