import { db } from "../../config/firebase";
import {
    Timestamp,
    collection,
    doc,
    getDoc,
    getDocs,
    or,
    orderBy,
    query,
    serverTimestamp,
    where,
    writeBatch,
} from "firebase/firestore";
import { sub } from "date-fns";
import { useEffect, useState } from "react";
import { uploadImageToStorage } from "./photo";
import { processLocation } from "../findLocation";
import { sendNoti } from "../noti";

const catColl = collection(db, "Cat");
const catUpdateColl = collection(db, "CatUpdate");

// Get new array of photo URLs, where profile pic is at the start
export const processNewPhotoURLs = async (catID, photoURI, isProfilePic) => {
    try {
        // Upload to storage and get download URL
        const downloadURL = await uploadImageToStorage(photoURI);

        // Get old data from Firestore to append the download URL
        const cat = (await getDoc(doc(db, "Cat", catID))).data();
        const newPhotoURLs = cat.photoURLs
            ? isProfilePic
                ? [downloadURL, ...cat.photoURLs] // new profile pic, appended at the start
                : [...cat.photoURLs, downloadURL] // just a new pic, appended at the end
            : [downloadURL];

        return newPhotoURLs;
    } catch (error) {
        console.error("Error in processNewPhotoURLs:", error);
        throw error;
    }
};

export const processNewConcernPhotoURLs = async (catID, photoURI) => {
    try {
        // Upload to storage and get download URL
        const downloadURL = await uploadImageToStorage(photoURI);

        // Get old data from Firestore to append the download URL
        const cat = (await getDoc(doc(db, "Cat", catID))).data();
        const newConcernPhotoURLs = cat.concernPhotoURLs
            ? [...cat.concernPhotoURLs, downloadURL]
            : [downloadURL];

        return newConcernPhotoURLs;
    } catch (error) {
        console.error("Error in processNewConcernPhotoURLs:", error);
        throw error;
    }
};

// Ensures cat's unfed status is correctly updated (unfed iff last fed >12h ago)
// Called in Cat Profile
export const autoProcessUnfed = async (cat) => {
    try {
        if (!cat.concernStatus) {
            return;
        }

        const currentTime = Date.now();
        const twelveHoursAgo = sub(currentTime, { hours: 12 });
        const lastFedTime = cat.lastFedTime;

        const unfed = lastFedTime && lastFedTime.toMillis() <= twelveHoursAgo;
        const updatedUnfed = cat.concernStatus.unfed;

        if (unfed && !updatedUnfed) {
            // Should be unfed, but is not
            await userUpdateCat("SYSTEM", cat.catID, "Update Concern (Unfed)", {
                "concernStatus.unfed": true,
            });
            await sendNoti("fed", cat.catID); // Send noti to alert that cat is unfed
        }

        if (!unfed && updatedUnfed) {
            await userUpdateCat("SYSTEM", cat.catID, "Update Concern (Fed)", {
                "concernStatus.unfed": false,
            });
        }
    } catch (error) {
        console.error("Error processing unfed status:", error);
        throw error;
    }
};

// Ensures cat's missing status is correctly updated (missing iff last seen >3 days ago)
// Called in Cat Profile
export const autoProcessMissing = async (cat) => {
    try {
        if (!cat.concernStatus) {
            return;
        }

        const currentTime = Date.now();
        const threeDaysAgo = sub(currentTime, { days: 3 }).getTime();
        const lastSeenTime = cat.lastSeenTime;

        const missing = lastSeenTime && lastSeenTime.toMillis() <= threeDaysAgo;
        const updatedMissing = cat.concernStatus.missing;
        if (missing && !updatedMissing) {
            // Should be missing, but is not
            await userUpdateCat(
                "SYSTEM",
                cat.catID,
                "Update Concern (Missing)",
                {
                    "concernStatus.missing": true,
                }
            );

            await sendNoti("missing", cat.catID); // Send noti to alert that cat is missing
        }

        if (!missing && updatedMissing) {
            // Should not be missing, but is
            await userUpdateCat(
                "SYSTEM",
                cat.catID,
                "Update Concern (Not Missing)",
                {
                    "concernStatus.missing": false,
                }
            );
        }
    } catch (error) {
        console.error("Error processing missing status:", error);
        throw error;
    }
};

// Ensures ALL cats have their unfed and missing status correctly updated
// Called in Dashboard
// Given there are n cats, this takes n reads for all cases and 2n writes for worst case
export const autoProcessConcernStatus = async () => {
    try {
        const querySnapshot = await getDocs(catColl);
        // console.log(
        //     "autoProcessConcernStatus, cats: ",
        //     querySnapshot.docs.length
        // );
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
export const useUserCreateCat = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    // isTemp to note if its from "Report New Cat" or "Create New Profile"
    const userCreateCat = async (userID, data, isTemp) => {
        try {
            setLoading([true]);
            setError([null]);

            const batch = writeBatch(db);

            // Add the cat document
            const catDoc = doc(catColl);
            const downloadURL = [await uploadImageToStorage(data.photoURI)];
            let processedData;
            if (isTemp) {
                const { coords, locationName, locationZone } =
                    await processLocation(data.lastSeenLocation);
                processedData = {
                    catID: catDoc.id,
                    name: "Cat " + new Date().valueOf().toString(),
                    photoURLs: downloadURL,
                    concernPhotoURLs:
                        data.concernStatus === "Injured" ? downloadURL : null,
                    gender: null,
                    birthYear: null,
                    sterilised: data.sterilised,
                    keyFeatures: data.concernDesc,
                    lastSeenLocation: coords,
                    locationName: locationName,
                    locationZone: locationZone,
                    lastSeenTime: Timestamp.fromDate(data.lastSeenTime),
                    lastFedTime: null,
                    concernStatus: {
                        injured: data.concernStatus === "Injured",
                        missing: false,
                        new: true,
                        unfed: false,
                    },
                    concernDesc: data.concernDesc,
                    updatedAt: serverTimestamp(),
                };
            } else {
                processedData = {
                    catID: catDoc.id,
                    name: data.name,
                    photoURLs: downloadURL,
                    concernPhotoURLs: null,
                    gender: data.gender,
                    birthYear: data.birthYear,
                    sterilised: data.sterilised,
                    keyFeatures: data.keyFeatures,
                    lastSeenLocation: null,
                    locationName: null,
                    locationZone: null,
                    lastSeenTime: null,
                    lastFedTime: null,
                    concernStatus: {
                        injured: false,
                        missing: false,
                        new: false,
                        unfed: false,
                    },
                    concernDesc: null,
                    updatedAt: serverTimestamp(),
                };
            }
            batch.set(catDoc, processedData);

            // Add the cat update document
            batch.set(doc(catUpdateColl), {
                updateType: isTemp ? "Create Cat Temp" : "CreateCat",
                userID: userID,
                catID: catDoc.id,
                updateFields: processedData,
                createTime: serverTimestamp(),
            });

            // Commit the batched operations
            await batch.commit();

            if (isTemp) {
                await sendNoti("new", catDoc.id); // Send noti to alert that new cat is sighted
            }
        } catch (error) {
            console.error("Error creating cat:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { userCreateCat, loading, error };
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

            const querySnapshot = await getDocs(
                query(catColl, orderBy("name"))
            );
            // console.log("getAllCats, cats: ", querySnapshot.docs.length);
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

            const catDoc = await getDoc(doc(db, "Cat", catID));
            // console.log("getCat, cats: 1");
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

            const q = query(
                catColl,
                where("concernStatus.unfed", "==", true),
                orderBy("name")
            );
            const querySnapshot = await getDocs(q);
            // console.log("getUnfedCats, cats: ", querySnapshot.docs.length);
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

            const q = query(
                catColl,
                or(
                    where("concernStatus.injured", "==", true),
                    where("concernStatus.missing", "==", true),
                    where("concernStatus.new", "==", true)
                ),
                orderBy("name")
            );
            const querySnapshot = await getDocs(q);
            // console.log("getCatsofConcern, cats: ", querySnapshot.docs.length);
            const cats = querySnapshot.docs.map((doc) => doc.data());
            setCatsofConcern(cats);
        } catch (error) {
            console.error("Error fetching cats of concern:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { getCatsofConcern, catsOfConcern, loading, error };
};

/* ----- UPDATE OPERATIONS ----- */
// Called in all update operations, writes to Cat document and creates CatUpdate document
export const userUpdateCat = async (
    userID,
    catID,
    updateType,
    updateFields
) => {
    const batch = writeBatch(db);

    // Update the cat document
    batch.update(doc(db, "Cat", catID), {
        ...updateFields,
        updatedAt: serverTimestamp(),
    });

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
    const [userLocation, setUserLocation] = useState(null);
    const [seenTime, setSeenTime] = useState(null);

    useEffect(() => {
        if (userLocation !== null && seenTime != null) {
            userUpdateCat(userID, catID, "Update Location", {
                lastSeenLocation: userLocation.coords,
                locationName: userLocation.locationName,
                locationZone: userLocation.locationZone,
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
            setUserLocation(null);
            setSeenTime(null);

            const { coords, locationName, locationZone } =
                await processLocation(location);
            setUserLocation({ coords, locationName, locationZone });

            setSeenTime(Timestamp.fromDate(time));
        } catch (error) {
            console.error("Error updating cat location:", error);
            setError([error]);
            setLoading([false]);
        }
    };

    return { userUpdateCatLocation, loading, error };
};

export const useUserUpdateCatConcern = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);
    const [processed, setProcessed] = useState(false);
    const [userID, setUserID] = useState("");
    const [catID, setCatID] = useState("");
    const [userLocation, setUserLocation] = useState({});
    const [seenTime, setSeenTime] = useState({});
    const [newPhotoURLs, setNewPhotoURLs] = useState([]);
    const [concernDesc, setConcernDesc] = useState("");
    const [concern, setConcern] = useState(""); // From form, either "Healthy" or "Injured"

    useEffect(() => {
        if (processed) {
            const handleUpdate = async () => {
                try {
                    if (concern === "Injured") {
                        await userUpdateCat(
                            userID,
                            catID,
                            "Update Concern (Injured)",
                            {
                                "concernStatus.injured": true,
                                lastSeenLocation: userLocation.coords,
                                locationName: userLocation.locationName,
                                locationZone: userLocation.locationZone,
                                concernDesc: concernDesc,
                                concernPhotoURLs: newPhotoURLs,
                                lastSeenTime: seenTime,
                            }
                        );
                        await sendNoti("injured", catID); // Send noti to alert that cat is injured
                    } else {
                        await userUpdateCat(
                            userID,
                            catID,
                            "Update Concern (Healthy)",
                            {
                                "concernStatus.injured": false,
                                lastSeenLocation: userLocation.coords,
                                locationName: userLocation.locationName,
                                locationZone: userLocation.locationZone,
                                concernDesc: concernDesc,
                                photoURLs: newPhotoURLs,
                                lastSeenTime: seenTime,
                            }
                        );
                    }
                } catch (error) {
                    console.error("Error updating cat concern:", error);
                    setError([error]);
                } finally {
                    setLoading([false]);
                }
            };

            handleUpdate();
        }
    }, [
        catID,
        concernDesc,
        concern,
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
        concern,
        concernDesc,
        photoURI
    ) => {
        try {
            if (
                !(
                    userID &&
                    catID &&
                    location &&
                    time &&
                    concern &&
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
            setUserLocation({});
            setConcern(concern);
            setConcernDesc(concernDesc);

            const { coords, locationName, locationZone } =
                await processLocation(location);
            setUserLocation({ coords, locationName, locationZone });

            setSeenTime(Timestamp.fromDate(time));

            let processedPhotoURLs;
            if (concern === "Healthy") {
                // Append to photoURLs
                processedPhotoURLs = await processNewPhotoURLs(
                    catID,
                    photoURI,
                    false
                );
            } else {
                // Append to concernPhotoURLs
                processedPhotoURLs = await processNewConcernPhotoURLs(
                    catID,
                    photoURI
                );
            }
            setNewPhotoURLs(processedPhotoURLs);

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
    const [fedTime, setFedTime] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (fedTime !== null && userLocation !== null) {
            userUpdateCat(userID, catID, "Update Fed", {
                lastFedTime: fedTime,
                lastSeenLocation: userLocation.coords,
                locationName: userLocation.locationName,
                locationZone: userLocation.locationZone,
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
            setUserLocation(null);
            setFedTime(null);

            const fedTime = Timestamp.fromDate(time);
            setFedTime(fedTime);

            const { coords, locationName, locationZone } =
                await processLocation(location);
            setUserLocation({ coords, locationName, locationZone });
        } catch (error) {
            console.error("Error updating cat fed:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { userUpdateCatFed, loading, error };
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
                    data.photoURI,
                    true
                );
                await userUpdateCat(userID, catID, "Update Profile", {
                    name: data.name,
                    photoURLs: newPhotoURLs,
                    gender: data.gender,
                    birthYear: data.birthYear,
                    sterilised: data.sterilised,
                    keyFeatures: data.keyFeatures,
                    "concernStatus.new": data.isNew,
                });
            } else {
                await userUpdateCat(userID, catID, "Update Profile", {
                    name: data.name,
                    gender: data.gender,
                    birthYear: data.birthYear,
                    sterilised: data.sterilised,
                    keyFeatures: data.keyFeatures,
                    "concernStatus.new": data.isNew,
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

// Throws error, to be handled in gallery
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

            const newPhotoURLs = await processNewPhotoURLs(
                catID,
                photoURI,
                false
            );
            await userUpdateCat(userID, catID, "Add Picture", {
                photoURLs: newPhotoURLs,
            });
        } catch (error) {
            console.error("Error adding cat picture:", error);
            setError([error]);
            throw error;
        } finally {
            setLoading([false]);
        }
    };

    return { userAddCatPicture, loading, error };
};

// Throws error, to be handled in gallery
export const useUserDeleteCatPictures = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const userDeleteCatPictures = async (userID, catID, newPhotoURLs, from) => {
        try {
            if (!(userID && catID && newPhotoURLs && from)) {
                throw new Error("Empty fields detected");
            }

            setLoading([true]);
            setError([null]);

            if (from === "Gallery") {
                await userUpdateCat(
                    userID,
                    catID,
                    "Delete Pictures (Gallery)",
                    {
                        photoURLs: newPhotoURLs,
                    }
                );
            } else {
                await userUpdateCat(
                    userID,
                    catID,
                    "Delete Pictures (Concern)",
                    {
                        concernPhotoURLs: newPhotoURLs,
                    }
                );
            }
        } catch (error) {
            console.error("Error deleting cat pictures:", error);
            setError([error]);
            throw error;
        } finally {
            setLoading([false]);
        }
    };

    return { userDeleteCatPictures, loading, error };
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
