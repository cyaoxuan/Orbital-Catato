import { db } from "../../config/firebase";
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { sub } from "date-fns";
import { useEffect, useState } from "react";

const catColl = collection(db, "Cat");
const catUpdateColl = collection(db, "CatUpdate");

// Note: Some functions are not exported as they are only used for testing / internal calls.
// This is to ensure that all changes to the database is logged and attributed to a user for accountability.
/* ----- CREATE OPERATIONS ----- */
export const useCreateCat = (data) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createCat = async () => {
        try {
            setLoading(true);
            setError(null);

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
            });
        } catch (error) {
            console.error("Error creating cat:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        createCat();
    })
    
    return { loading, error };
};

/* ----- READ OPERATIONS ----- */
export const useAllCats = () => {
    const [allCats, setAllCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllCats = async () => {
            try {
                const querySnapshot = await getDocs(catColl);
                const cats = querySnapshot.docs.map((doc) => doc.data());
                setAllCats(cats);
            } catch (error) {
                console.error("Error fetching all cats:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllCats();
    }, []);

    return { allCats, loading, error };
};

export const useCat = (catID) => {
    const [cat, setCat] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCat = async () => {
            try {
                setLoading(true);
                setError(null);
                setCat((await getDoc(doc(db, "Cat", catID))).data());
            } catch (error) {
                console.error("Error fetching cat:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCat();
    }, [catID]);

    return { cat, loading, error };
};

export const useUnfedCats = () => {
    const [unfedCats, setUnfedCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUnfedCats = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const twelveHoursAgo = Timestamp.fromDate(sub(Date.now(), { hours: 12 }));
                const q = query(catColl, where("lastFedTime", "<", twelveHoursAgo));
                const querySnapshot = await getDocs(q);
                const cats = querySnapshot.docs.map((doc) => doc.data());
                setUnfedCats(cats);
            } catch (error) {
                console.error("Error fetching unfed cats:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUnfedCats();
    }, []);

    return { unfedCats, loading, error };
};

export const useCatsofConcern = () => {
    const [catsOfConcern, setCatsofConcern] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCatsofConcern = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const q = query(catColl, where("concernStatus", "!=", []));
                const querySnapshot = await getDocs(q);
                const cats = querySnapshot.docs.map((doc) => doc.data());
                setCatsofConcern(cats);
            } catch (error) {
                console.error("Error fetching unfed cats:", error);
                setError(error);
            } finally {
                setLoading(false);
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


export const useUserUpdateCatLocation = (userID, catID, location) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userUpdateCatLocation = async () => {
        try {
            setLoading(true);
            setError(null);

            await userUpdateCat(userID, catID, "Update Location", {
                lastSeenLocation: location,
                lastSeenTime: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error updating cat location:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        userUpdateCatLocation();
    });
    
    return { loading, error };
};

export const useUserUpdateCatConcern = (userID, catID, concernStatus, location, concernDesc, photoURLs) => {
    // TODO: Handle the photo by storing it into cloud storage, then appending URL into the photoURLs field
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userUpdateCatConcern = async () => {
        try {
            setLoading(true);
            setError(null);

            await userUpdateCat(userID, catID, "Update Concern", {
                concernStatus: concernStatus,
                lastSeenLocation: location,
                concernDesc: concernDesc,
                photoURLs: photoURLs,
                lastSeenTime: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error updating cat concern:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        userUpdateCatConcern();
    });
    
    return { loading, error };
};

export const useUserUpdateCatFed = (userID, catID, time, location) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userUpdateCatFed = async () => {
        try {
            setLoading(true);
            setError(null);

            await userUpdateCat(userID, catID, "Update Fed", {
                lastFedTime: time,
                lastSeenLocation: location,
                lastSeenTime: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error updating cat fed:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        userUpdateCatFed();
    });
    
    return { loading, error };
};

export const useUserUpdateCatFoster = (userID, catID, isFostered, reason) => {
    // TODO
};

export const useUserUpdateCatProfile = (userID, catID, data) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userUpdateCatProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            // TODO: List out the data
            await userUpdateCat(userID, catID, "Update Profile", data);
        } catch (error) {
            console.error("Error updating cat profile:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        userUpdateCatProfile();
    });
    
    return { loading, error };
};

/* ----- DELETE OPERATIONS ----- */
export const useUserDeleteCat = (userID, catID) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userDeleteCat = async () => {
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
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        userDeleteCat();
    });
    
    return { loading, error };
};