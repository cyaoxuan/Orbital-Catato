import { db } from "../../config/firebase";
import { Timestamp, addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where, writeBatch } from "firebase/firestore";
import { sub } from "date-fns";
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import Geohash from "latlon-geohash";

const catColl = collection(db, "Cat");
const catUpdateColl = collection(db, "CatUpdate");

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

            // TODO: Redefine default values
            const newCatRef = doc(catColl);
            await addDoc(catColl, {
                catID: newCatRef.id,
                name: data.name || "NONE",
                photoURLs: data.photoURLs || [],
                gender: data.gender || "NONE",
                birthYear: data.birthYear || -1,
                sterilised: data.sterilised || false,
                keyFeatures: data.keyFeatures || "NONE",
                lastSeenLocation: data.lastSeenLocation || "NONE",
                lastSeenTime: data.lastSeenTime || serverTimestamp(),
                lastFedTime: data.lastFedTime || serverTimestamp(),
                concernStatus: data.concernStatus || [],
                concernDesc: data.concernDesc || "NONE",
                isFostered: data.isFostered || false,
                fosterReason: data.fosterReason || "NONE"
            });
        } catch (error) {
            console.error("Error creating cat:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };
    
    return { createCat, loading, error };
};

/* ----- READ OPERATIONS ----- */
export const useAllCats = () => {
    const [allCats, setAllCats] = useState([]);
    const [loading, setLoading] = useState([true]);
    const [error, setError] = useState([null]);

    useEffect(() => {
        const fetchAllCats = async () => {
            try {
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

        fetchAllCats();
    }, []);

    return { allCats, loading, error };
};

export const useCat = (catID) => {
    const [cat, setCat] = useState({});
    const [loading, setLoading] = useState([true]);
    const [error, setError] = useState([null]);

    useEffect(() => {
        const fetchCat = async () => {
            try {
                setLoading([true]);
                setError([null]);
                setCat((await getDoc(doc(db, "Cat", catID))).data());
            } catch (error) {
                console.error("Error fetching cat:", error);
                setError([error]);
            } finally {
                setLoading([false]);
            }
        };

        fetchCat();
    }, [catID]);

    return { cat, loading, error };
};

export const useUnfedCats = () => {
    const [unfedCats, setUnfedCats] = useState([]);
    const [loading, setLoading] = useState([true]);
    const [error, setError] = useState([null]);

    useEffect(() => {
        const fetchUnfedCats = async () => {
            try {
                setLoading([true]);
                setError([null]);
                
                const twelveHoursAgo = Timestamp.fromDate(sub(Date.now(), { hours: 12 }));
                const q = query(catColl, where("lastFedTime", "<", twelveHoursAgo));
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

        fetchUnfedCats();
    }, []);

    return { unfedCats, loading, error };
};

export const useCatsofConcern = () => {
    const [catsOfConcern, setCatsofConcern] = useState([]);
    const [loading, setLoading] = useState([true]);
    const [error, setError] = useState([null]);

    useEffect(() => {
        const fetchCatsofConcern = async () => {
            try {
                setLoading([true]);
                setError([null]);
                
                const q = query(catColl, where("concernStatus", "!=", []));
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

        fetchCatsofConcern();
    }, []);

    return { catsOfConcern, loading, error };
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

    useEffect(() => {
        if (userLocation !== null) {
            userUpdateCat(userID, catID, "Update Location", {
                lastSeenLocation: userLocation,
                lastSeenTime: serverTimestamp()
            }).catch(error => {
                console.error("Error updating location:", error);
                setError([error]);
            }).finally(() => {
                setLoading([false]);
            });
        }
    }, [catID, userID, userLocation]);

    const userUpdateCatLocation = async (userID, catID, location) => {
        try {
            setLoading([true]);
            setError([null]);
            setUserID(userID);
            setCatID(catID);
            setUserLocation(null);

            // TODO: Fix such that userLocation is actually set before the update is called
            if (location == "Use Current Location") {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    throw new Error("Locations permissions denied");
                }

                const loc = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
                const geohash = Geohash.encode(loc.coords.latitude, loc.coords.longitude);
                setUserLocation(geohash);
            } else {
                setUserLocation(location);
            }

            // await userUpdateCat(userID, catID, "Update Location", {
            //     lastSeenLocation: userLocation,
            //     lastSeenTime: serverTimestamp()
            // });
        } catch (error) {
            console.error("Error getting location:", error);
            setError([error]);
            setLoading([false]);
        }
    };
    
    return { userUpdateCatLocation, loading, error };
};

export const useUserUpdateCatConcern = () => {
    // TODO: Handle the photo by storing it into cloud storage, then appending URL into the photoURLs field
    const [loading, setLoading] = useState([false]);
    const [error, setError] = useState([null]);

    const userUpdateCatConcern = async (userID, catID, concernStatus, location, concernDesc, photoURLs) => {
        try {
            setLoading([true]);
            setError([null]);

            await userUpdateCat(userID, catID, "Update Concern", {
                concernStatus: concernStatus,
                lastSeenLocation: location,
                concernDesc: concernDesc,
                photoURLs: photoURLs,
                lastSeenTime: serverTimestamp(),
            });
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

    const userUpdateCatFed = async (userID, catID, time, location) => {
        try {
            setLoading([true]);
            setError([null]);

            await userUpdateCat(userID, catID, "Update Fed", {
                lastFedTime: time,
                lastSeenLocation: location,
                lastSeenTime: serverTimestamp(),
            });
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
            setLoading([true]);
            setError([null]);

            await userUpdateCat(userID, catID, "Update Foster", {
                isFostered: isFostered,
                fosterReason: fosterReason || "NONE"
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
            setLoading([true]);
            setError([null]);

            // TODO: List out the data
            await userUpdateCat(userID, catID, "Update Profile", data);
        } catch (error) {
            console.error("Error updating cat profile:", error);
            setError([error]);
        } finally {
            setLoading([false]);
        }
    };

    
    return { userUpdateCatProfile, loading, error };
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