import { db } from "../../config/firebase";
import {
    Timestamp,
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";
import { sub } from "date-fns";
import { useEffect, useState } from "react";
import { uploadImageToStorage } from "./photo";
import * as Location from "expo-location";
import Geohash from "latlon-geohash";

const catColl = collection(db, "Cat");
const catUpdateColl = collection(db, "CatUpdate");

const processLocation = async (location) => {
    try {
        if (location == "Use Current Location") {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                throw new Error("Locations permissions denied");
            }

            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            const geohash = Geohash.encode(
                loc.coords.latitude,
                loc.coords.longitude
            );
            location = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            };
        }

        return location;
    } catch (error) {
        console.error("Error in processLocation:", error);
        throw error;
    }
};

const processNewPhotoURLs = async (catID, photoURI) => {
    try {
        // Upload to storage and get download URL
        const downloadURL = await uploadImageToStorage(photoURI);

        // Get old data from Firestore to append the download URL
        const cat = (await getDoc(doc(db, "Cat", catID))).data();
        const newPhotoURLs = cat.photoURLs
            ? [...cat.photoURLs, downloadURL]
            : [downloadURL];

        return newPhotoURLs;
    } catch (error) {
        console.error("Error in processNewPhotoURLs:", error);
        throw error;
    }
};

const autoProcessUnfed = async (cat) => {
    try {
        const currentTime = Date.now();
        const twelveHoursAgo = sub(currentTime, { hours: 12 });
        const oldConcernStatus = cat.concernStatus;
        const lastFedTime = cat.lastFedTime;

        const unfed = lastFedTime && lastFedTime.toMillis() <= twelveHoursAgo;
        const updatedUnfed =
            oldConcernStatus && oldConcernStatus.includes("Unfed");

        if (unfed && !updatedUnfed) {
            // Should be unfed, but is not
            await userUpdateCat("SYSTEM", cat.catID, "Update Concern (Unfed)", {
                concernStatus: oldConcernStatus
                    ? [...oldConcernStatus, "Unfed"]
                    : ["Unfed"],
            });
        }

        if (!unfed && updatedUnfed) {
            // Should not be unfed, but is
            const newConcernStatus = oldConcernStatus.filter(
                (concern) => concern !== "Unfed"
            );
            await userUpdateCat("SYSTEM", cat.catID, "Update Concern (Unfed)", {
                concernStatus: newConcernStatus,
            });
        }
    } catch (error) {
        console.error("Error processing unfed status:", error);
        throw error;
    }
};

const autoProcessMissing = async (cat) => {
    try {
        const currentTime = Date.now();
        const threeDaysAgo = sub(currentTime, { days: 3 }).getTime();
        const oldConcernStatus = cat.concernStatus;
        const lastSeenTime = cat.lastSeenTime;

        const missing = lastSeenTime && lastSeenTime.toMillis() <= threeDaysAgo;
        const updatedMissing =
            oldConcernStatus && oldConcernStatus.includes("Missing");
        if (missing && !updatedMissing) {
            // Should be missing, but is not
            await userUpdateCat(
                "SYSTEM",
                cat.catID,
                "Update Concern (Missing)",
                {
                    concernStatus: oldConcernStatus
                        ? [...oldConcernStatus, "Missing"]
                        : ["Missing"],
                }
            );
        }

        if (!missing && updatedMissing) {
            // Should not be missing, but is
            const newConcernStatus = oldConcernStatus.filter(
                (concern) => concern !== "Missing"
            );
            await userUpdateCat(
                "SYSTEM",
                cat.catID,
                "Update Concern (Missing)",
                {
                    concernStatus: newConcernStatus,
                }
            );
        }
    } catch (error) {
        console.error("Error processing missing status:", error);
        throw error;
    }
};

const autoProcessConcernStatus = async () => {
    try {
        const querySnapshot = await getDocs(catColl);
        const cats = querySnapshot.docs.map((doc) => doc.data());

        for (let i = 0; i < cats.length; i++) {
            const cat = cats[i];
            await autoProcessMissing(cat);
            await autoProcessUnfed(cat);
        }
    } catch (error) {
        console.error("Error in autoProcessConcernStatus:", error);
        throw error;
    }
};

// Note: Some functions are not exported as they are only used for testing / internal calls.
// This is to ensure that all changes to the database is logged and attributed to a user for accountability.
/* ----- CREATE OPERATIONS ----- */
export const useCreateCat = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const createCat = async (data) => {
        try {
            setLoading([true]);
            setError([null]);

            let downloadURL;
            if (data.photoURI) {
                downloadURL = [await uploadImageToStorage(data.photoURI)];
            }

            // TODO: Redefine default values
            const cat = await addDoc(catColl, {
                name: data.name,
                photoURLs: downloadURL,
                gender: data.gender,
                birthYear: data.birthYear,
                sterilised: data.sterilised,
                keyFeatures: data.keyFeatures,
                lastSeenLocation: data.lastSeenLocation,
                lastSeenTime: data.lastSeenTime,
                lastFedTime: data.lastFedTime,
                concernStatus: data.concernStatus,
                concernDesc: data.concernDesc,
                isFostered: data.isFostered,
                fosterReason: data.fosterReason,
            });

            await updateDoc(doc(db, "Cat", cat.id), { catID: cat.id });
        } catch (error) {
            console.error("Error creating cat:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { createCat, loading, error };
};

export const useCreateTempCat = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const createTempCat = async (data) => {
        try {
            setLoading([true]);
            setError([null]);

            let downloadURL;
            if (data.photoURI) {
                downloadURL = [await uploadImageToStorage(data.photoURI)];
            }

            // TODO: Redefine default values
            const cat = await addDoc(catColl, {
                name: "Cat " + new Date().valueOf().toString(),
                photoURLs: downloadURL,
                lastSeenLocation: data.lastSeenLocation,
                lastSeenTime: data.lastSeenTime,
                concernStatus:
                    data.concernStatus === "Healthy"
                        ? ["New"]
                        : ["Injured", "New"],
                concernDesc: data.concernDesc,
                sterilised: data.sterilised,
            });

            await updateDoc(doc(db, "Cat", cat.id), { catID: cat.id });
        } catch (error) {
            console.error("Error creating cat:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { createTempCat, loading, error };
};

/* ----- READ OPERATIONS ----- */
export const useGetAllCats = () => {
    const [allCats, setAllCats] = useState([]);
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const getAllCats = async () => {
        try {
            setLoading([true]);
            setError([null]);

            await autoProcessConcernStatus();
            const querySnapshot = await getDocs(catColl);
            const cats = querySnapshot.docs.map((doc) => doc.data());
            setAllCats(cats);
        } catch (error) {
            console.error("Error fetching all cats:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { getAllCats, allCats, loading, error };
};

export const useGetCat = () => {
    const [cat, setCat] = useState(null);
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const getCat = async (catID) => {
        try {
            setLoading([true]);
            setError([null]);

            await autoProcessConcernStatus();
            const catDoc = await getDoc(doc(db, "Cat", catID));
            const catData = catDoc.data();
            setCat(catData);
        } catch (error) {
            console.error("Error fetching cat:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { getCat, cat, loading, error };
};

export const useGetUnfedCats = () => {
    const [unfedCats, setUnfedCats] = useState([]);
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const getUnfedCats = async () => {
        try {
            setLoading([true]);
            setError([null]);

            await autoProcessConcernStatus();
            const q = query(
                catColl,
                where("concernStatus", "array-contains", "Unfed")
            );
            const querySnapshot = await getDocs(q);
            const cats = querySnapshot.docs.map((doc) => doc.data());
            setUnfedCats(cats);
        } catch (error) {
            console.error("Error fetching unfed cats:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { getUnfedCats, unfedCats, loading, error };
};

export const useGetCatsofConcern = () => {
    const [catsOfConcern, setCatsofConcern] = useState([]);
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const getCatsofConcern = async () => {
        try {
            setLoading([true]);
            setError([null]);

            await autoProcessConcernStatus();
            const q = query(
                catColl,
                where("concernStatus", "array-contains-any", [
                    "Injured",
                    "Missing",
                    "New",
                ])
            );
            const querySnapshot = await getDocs(q);
            const cats = querySnapshot.docs.map((doc) => doc.data());
            setCatsofConcern(cats);
        } catch (error) {
            console.error("Error fetching unfed cats:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { getCatsofConcern, catsOfConcern, loading, error };
};

/* ----- UPDATE OPERATIONS ----- */
const userUpdateCat = async (userID, catID, updateType, updateFields) => {
    const batch = writeBatch(db);

    // Update the cat document
    batch.update(doc(db, "Cat", catID), updateFields);

    // Add the cat update document
    batch.set(doc(catUpdateColl), {
        updateType: updateType,
        userID: userID,
        catID: catID,
        updateFields: updateFields,
        createTime: serverTimestamp(),
    });

    // Commit the batched operations
    await batch.commit();
};

export const useUserUpdateCatLocation = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);
    const [userID, setUserID] = useState("");
    const [catID, setCatID] = useState("");
    const [userLocation, setUserLocation] = useState("");
    const [seenTime, setSeenTime] = useState({});

    useEffect(() => {
        if (userLocation !== "" && seenTime != {}) {
            userUpdateCat(userID, catID, "Update Location", {
                lastSeenLocation: userLocation,
                lastSeenTime: seenTime,
            })
                .catch((error) => {
                    console.error("Error updating cat location:", error);
                    setError([error]);
                })
                .finally(() => {
                    setLoading([false]);
                });
        }
    }, [catID, seenTime, userID, userLocation]);

    const userUpdateCatLocation = async (userID, catID, location, time) => {
        try {
            if (!(userID && catID && location && time)) {
                throw new Error("Empty fields detected");
            }

            setLoading([true]);
            setError([null]);
            setUserID(userID);
            setCatID(catID);
            setUserLocation("");

            const userLocation = await processLocation(location);
            setUserLocation(userLocation);

            setSeenTime(Timestamp.fromDate(time));
        } catch (error) {
            console.error("Error updating cat location:", error);
            setError([error]);
            setLoading([false]);
        }
    };

    return { userUpdateCatLocation, loading, error };
};

// handle injured, healthy
export const useUserUpdateCatConcern = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);
    const [processed, setProcessed] = useState(false);
    const [userID, setUserID] = useState("");
    const [catID, setCatID] = useState("");
    const [concernStatus, setConcernStatus] = useState("");
    const [concernDesc, setConcernDesc] = useState("");
    const [userLocation, setUserLocation] = useState("");
    const [seenTime, setSeenTime] = useState({});
    const [newPhotoURLs, setNewPhotoURLs] = useState([]);
    const [newConcernStatus, setNewConcernStatus] = useState([]);

    useEffect(() => {
        if (
            processed &&
            userLocation !== "" &&
            newPhotoURLs !== [] &&
            newConcernStatus !== []
        ) {
            userUpdateCat(userID, catID, "Update Concern", {
                concernStatus: concernStatus,
                lastSeenLocation: userLocation,
                concernDesc: concernDesc,
                photoURLs: newPhotoURLs,
                lastSeenTime: seenTime,
            })
                .catch((error) => {
                    console.error("Error updating cat concern:", error);
                    setError([error]);
                })
                .finally(() => {
                    setLoading([false]);
                });
        }
    }, [
        catID,
        concernDesc,
        concernStatus,
        newConcernStatus,
        newPhotoURLs,
        processed,
        seenTime,
        userID,
        userLocation,
    ]);

    const userUpdateCatConcern = async (
        userID,
        catID,
        location,
        time,
        concernStatus,
        concernDesc,
        photoURI,
        oldConcernStatus
    ) => {
        try {
            if (
                !(
                    userID &&
                    catID &&
                    location &&
                    time &&
                    concernStatus &&
                    concernDesc &&
                    photoURI
                )
            ) {
                throw new Error("Empty fields detected");
            }

            setLoading([true]);
            setError([null]);
            setProcessed(false);
            setUserID(userID);
            setCatID(catID);
            setConcernDesc(concernDesc);

            const userLocation = await processLocation(location);
            setUserLocation(userLocation);

            setSeenTime(Timestamp.fromDate(time));

            const newPhotoURLs = await processNewPhotoURLs(catID, photoURI);
            setNewPhotoURLs(newPhotoURLs);

            let newConcernStatus;
            if (concernStatus === "Healthy") {
                newConcernStatus = oldConcernStatus.filter(
                    (status) => status !== "Injured"
                );
            } else {
                if (!oldConcernStatus) {
                    newConcernStatus = ["Injured"];
                } else {
                    if (oldConcernStatus.includes("Injured")) {
                        newConcernStatus = oldConcernStatus;
                    } else {
                        newConcernStatus = [...oldConcernStatus, "Injured"];
                    }
                }
            }
            setConcernStatus(newConcernStatus);

            setProcessed(true);
        } catch (error) {
            console.error("Error updating cat concern:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { userUpdateCatConcern, loading, error };
};

export const useUserUpdateCatFed = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);
    const [userID, setUserID] = useState("");
    const [catID, setCatID] = useState("");
    const [fedTime, setFedTime] = useState({});
    const [userLocation, setUserLocation] = useState("");

    useEffect(() => {
        if (fedTime !== {} && userLocation !== "") {
            userUpdateCat(userID, catID, "Update Fed", {
                lastFedTime: fedTime,
                lastSeenLocation: userLocation,
                lastSeenTime: fedTime,
            })
                .catch((error) => {
                    console.error("Error updating cat fed:", error);
                    setError([error]);
                })
                .finally(() => {
                    setLoading([false]);
                });
        }
    }, [catID, fedTime, userID, userLocation]);

    const userUpdateCatFed = async (userID, catID, time, location) => {
        try {
            if (!(userID && catID && location && time)) {
                throw new Error("Empty fields detected");
            }

            setLoading([true]);
            setError([null]);
            setUserID(userID);
            setCatID(catID);

            const fedTime = Timestamp.fromDate(time);
            setFedTime(fedTime);

            const userLocation = await processLocation(location);
            setUserLocation(userLocation);
        } catch (error) {
            console.error("Error updating cat fed:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { userUpdateCatFed, loading, error };
};

export const useUserUpdateCatFoster = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const userUpdateCatFoster = async (
        userID,
        catID,
        isFostered,
        fosterReason
    ) => {
        try {
            if (!(userID && catID && isFostered && fosterReason)) {
                throw new Error("Empty fields detected");
            }

            setLoading([true]);
            setError([null]);

            await userUpdateCat(userID, catID, "Update Foster", {
                isFostered: isFostered,
                fosterReason: fosterReason || "NONE",
            });
        } catch (error) {
            console.error("Error updating cat foster:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { userUpdateCatFoster, loading, error };
};

export const useUserUpdateCatProfile = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const userUpdateCatProfile = async (userID, catID, data) => {
        try {
            if (!(userID && catID && data)) {
                throw new Error("Empty fields detected");
            }

            setLoading([true]);
            setError([null]);

            if (data.photoURI) {
                const newPhotoURLs = await processNewPhotoURLs(
                    catID,
                    data.photoURI
                );
                await userUpdateCat(userID, catID, "Update Profile", {
                    name: data.name,
                    photoURLs: newPhotoURLs,
                    gender: data.gender,
                    birthYear: data.birthYear,
                    sterilised: data.sterilised,
                    keyFeatures: data.keyFeatures,
                });
            } else {
                await userUpdateCat(userID, catID, "Update Profile", {
                    name: data.name || "NONE",
                    gender: data.gender || "NONE",
                    birthYear: data.birthYear || -1,
                    sterilised: data.sterilised || false,
                    keyFeatures: data.keyFeatures || "NONE",
                });
            }
        } catch (error) {
            console.error("Error updating cat profile:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { userUpdateCatProfile, loading, error };
};

export const useUserAddCatPicture = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const userAddCatPicture = async (userID, catID, photoURI) => {
        try {
            if (!(userID && catID && photoURI)) {
                throw new Error("Empty fields detected");
            }

            setLoading([true]);
            setError([null]);

            const newPhotoURLs = await processNewPhotoURLs(catID, photoURI);
            await userUpdateCat(userID, catID, "Add Picture", {
                photoURLs: newPhotoURLs,
            });
        } catch (error) {
            console.error("Error adding cat picture:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { userAddCatPicture, loading, error };
};

/* ----- DELETE OPERATIONS ----- */
export const useUserDeleteCat = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const userDeleteCat = async (userID, catID) => {
        try {
            const batch = writeBatch(db);

            // Delete the cat document
            batch.delete(doc(db, "Cat", catID));

            // Add the cat update document
            batch.set(doc(catUpdateColl), {
                updateType: "Delete",
                userID: userID,
                catID: catID,
                updateFields: null,
                createTime: serverTimestamp(),
            });

            // Commit the batched operations
            await batch.commit();
        } catch (error) {
            console.error("Error deleting cat:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { userDeleteCat, loading, error };
};
