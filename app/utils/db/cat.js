import { db } from "../../config/firebase";
import { Timestamp, addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from "firebase/firestore";
import { sub } from "date-fns";
import { useEffect, useState } from "react";
import { uploadImageToStorage } from "./photo"
import { processLocation } from "../findLocation";

const catColl = collection(db, "Cat");
const catUpdateColl = collection(db, "CatUpdate");

const processNewPhotoURLs = async (catID, photoURI) => {
    try {
        // Upload to storage and get download URL
        const downloadURL = await uploadImageToStorage(photoURI);

        // Get old data from Firestore to append the download URL
        const cat = (await getDoc(doc(db, "Cat", catID))).data();
        const newPhotoURLs = cat.photoURLs ? [...cat.photoURLs, downloadURL] : [downloadURL];

        return newPhotoURLs;    
    } catch (error) {
        console.error("Error in processNewPhotoURLs:", error);
        throw error;
    }
};

export const autoProcessUnfed = async (cat) => {
    try {
        const currentTime = Date.now();
        const twelveHoursAgo = sub(currentTime, { hours: 12 });
        const oldConcernStatus = cat.concernStatus;
        const lastFedTime = cat.lastFedTime;

        const unfed = lastFedTime && lastFedTime.toMillis() <= twelveHoursAgo;
        const updatedUnfed = oldConcernStatus && oldConcernStatus.includes("Unfed");

        if (unfed && !updatedUnfed) {
            // Should be unfed, but is not
            await userUpdateCat("SYSTEM", cat.catID, "Update Concern (Unfed)", {
                concernStatus: oldConcernStatus ? [...oldConcernStatus, "Unfed"] : ["Unfed"]
            });
        }

        if (!unfed && updatedUnfed) {
            // Should not be unfed, but is
            const newConcernStatus = oldConcernStatus.filter((concern) => concern !== "Unfed");
            await userUpdateCat("SYSTEM", cat.catID, "Update Concern (Unfed)", {
                concernStatus: newConcernStatus
            });
        }
    } catch (error) {
        console.error("Error processing unfed status:", error);
        throw error;
    }
};

export const autoProcessMissing = async (cat) => {
    try {
        const currentTime = Date.now();
        const threeDaysAgo = sub(currentTime, { days: 3 }).getTime();
        const oldConcernStatus = cat.concernStatus;
        const lastSeenTime = cat.lastSeenTime;

        const missing = lastSeenTime && lastSeenTime.toMillis() <= threeDaysAgo;
        const updatedMissing = oldConcernStatus && oldConcernStatus.includes("Missing");
        if (missing && !updatedMissing) {
            // Should be missing, but is not
            await userUpdateCat("SYSTEM", cat.catID, "Update Concern (Missing)", {
                concernStatus: oldConcernStatus ? [...oldConcernStatus, "Missing"] : ["Missing"]
            });
        }

        if (!missing && updatedMissing) {
            // Should not be missing, but is
            const newConcernStatus = oldConcernStatus.filter((concern) => concern !== "Missing");
            await userUpdateCat("SYSTEM", cat.catID, "Update Concern (Missing)", {
                concernStatus: newConcernStatus
            });
        }
    } catch (error) {
        console.error("Error processing missing status:", error);
        throw error;
    }
};

export const autoProcessConcernStatus = async () => {
    try {
        console.log("calling autoProcessConcernStatus");
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
export const useUserCreateCat = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const userCreateCat = async (userID, data, isTemp) => {
        try {
            setLoading([true]);
            setError([null]);

            const batch = writeBatch(db);

            // Add the cat document
            const catDoc = doc(catColl);
            const downloadURL = [await uploadImageToStorage(data.photoURI)];
            let processedData;
            // TODO: redefine default values
            if (isTemp) {
                const { coords, locationName, locationZone } = await processLocation(data.lastSeenLocation);
                processedData = {
                    catID: catDoc.id,
                    name: "Cat " + new Date().valueOf().toString(),
                    photoURLs: downloadURL,
                    gender: null,
                    birthYear: null,
                    sterilised: data.sterilised,
                    keyFeatures: null,
                    lastSeenLocation: coords,
                    locationName: locationName,
                    locationZone: locationZone,
                    lastSeenTime: Timestamp.fromDate(data.lastSeenTime),
                    lastFedTime: null,
                    concernStatus: data.concernStatus === "Healthy" ? ["New"] : ["Injured", "New"],
                    concernDesc: data.concernDesc,
                    isFostered: false,
                    fosterReason: null
                };
            } else {
                processedData = {
                    catID: catDoc.id,
                    name: data.name,
                    photoURLs: downloadURL,
                    gender: data.gender,
                    birthYear: data.birthYear,
                    sterilised: data.sterilised,
                    keyFeatures: data.keyFeatures,
                    lastSeenLocation: null,
                    locationName: null,
                    locationZone: null,
                    lastSeenTime: null,
                    lastFedTime: null,
                    concernStatus: null,
                    concernDesc: null,
                    isFostered: false,
                    fosterReason: null
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

            const q = query(catColl, where("concernStatus", "array-contains", "Unfed"));
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
            
            const q = query(catColl, where("concernStatus", "array-contains-any", ["Injured", "Missing", "New"]));
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
    const [userLocation, setUserLocation] = useState(null);
    const [seenTime, setSeenTime] = useState(null);

    useEffect(() => {
        if (userLocation !== null && seenTime != null) {
            userUpdateCat(userID, catID, "Update Location", {
                lastSeenLocation: userLocation.coords,
                locationName: userLocation.locationName,
                locationZone: userLocation.locationZone,
                lastSeenTime: seenTime
            }).catch(error => {
                console.error("Error updating cat location:", error);
                setError([error]);
            }).finally(() => {
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
            
            const { coords, locationName, locationZone } = await processLocation(location);
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
    const [concernStatus, setConcernStatus] = useState("");
    const [concernDesc, setConcernDesc] = useState("");
    const [userLocation, setUserLocation] = useState({});
    const [seenTime, setSeenTime] = useState({});
    const [newPhotoURLs, setNewPhotoURLs] = useState([]);

    useEffect(() => {
        if (processed && userLocation !== {} && newPhotoURLs !== [] && concernStatus !== []) {
            userUpdateCat(userID, catID, "Update Concern", {
                concernStatus: concernStatus,
                lastSeenLocation: userLocation.coords,
                locationName: userLocation.locationName,
                locationZone: userLocation.locationZone,
                concernDesc: concernDesc,
                photoURLs: newPhotoURLs,
                lastSeenTime: seenTime,
            }).catch(error => {
                console.error("Error updating cat concern:", error);
                setError([error]);
            }).finally(() => {
                setLoading([false]);
            });
        }
    }, [catID, concernDesc, concernStatus, newPhotoURLs, processed, seenTime, userID, userLocation]);

    const userUpdateCatConcern = async (userID, catID, location, time, concernStatus, concernDesc, photoURI, oldConcernStatus) => {
        try {
            if (!(userID && catID && location && time && concernStatus && concernDesc && photoURI)) {
                throw new Error("Empty fields detected");
            }

            setLoading([true]);
            setError([null]);
            setProcessed(false);
            setUserID(userID);
            setCatID(catID);
            setUserLocation({});
            setConcernDesc(concernDesc);
            
            const { coords, locationName, locationZone } = await processLocation(location);
            setUserLocation({ coords, locationName, locationZone });

            setSeenTime(Timestamp.fromDate(time));

            const newPhotoURLs = await processNewPhotoURLs(catID, photoURI);
            setNewPhotoURLs(newPhotoURLs);

            let newConcernStatus;
            if (concernStatus === "Healthy") {
                newConcernStatus = oldConcernStatus.filter((status) => status !== "Injured");
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
            }).catch(error => {
                console.error("Error updating cat fed:", error);
                setError([error]);
            }).finally(() => {
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

            const { coords, locationName, locationZone } = await processLocation(location);
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

export const useUserUpdateCatFoster = () => {
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const userUpdateCatFoster = async (userID, catID, isFostered, fosterReason) => {
        try {
            if (!(userID && catID && isFostered && fosterReason)) {
                throw new Error("Empty fields detected");
            }

            setLoading([true]);
            setError([null]);

            await userUpdateCat(userID, catID, "Update Foster", {
                isFostered: isFostered === "Yes",
                fosterReason: fosterReason
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
                const newPhotoURLs = await processNewPhotoURLs(catID, data.photoURI);
                await userUpdateCat(userID, catID, "Update Profile", {
                    name: data.name,
                    photoURLs: newPhotoURLs,
                    gender: data.gender,
                    birthYear: data.birthYear,
                    sterilised: data.sterilised,
                    keyFeatures: data.keyFeatures
                });
            } else {
                await userUpdateCat(userID, catID, "Update Profile", {
                    name: data.name || "NONE",
                    gender: data.gender || "NONE",
                    birthYear: data.birthYear || -1,
                    sterilised: data.sterilised || false,
                    keyFeatures: data.keyFeatures || "NONE"
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
                photoURLs: newPhotoURLs
            });
        } catch (error) {
            console.error("Error adding cat picture:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    return { userAddCatPicture, loading, error };
}

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