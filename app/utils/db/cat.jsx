import { db } from "../../config/firebase";
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { sub } from "date-fns";

const catColl = collection(db, "Cat");
const catUpdateColl = collection(db, "CatUpdate");

// Note: Some functions are not exported as they are only used for testing / internal calls.
// This is to ensure that all changes to the database is logged and attributed to a user for accountability.
/* ----- CREATE OPERATIONS ----- */
export const createCat = async (data) => {
    // TODO: Redefine default values
    const cat = await addDoc(catColl, {
        "name": data.name || "NONE",
        "photoURL": data.photoURL || "NONE",
        "gender": data.gender || "NONE",
        "birthYear": data.birthYear || -1,
        "sterilised": data.sterilised || false,
        "keyFeatures": data.keyFeatures || "NONE",
        "lastSeenLocation": data.lastSeenLocation || "NONE",
        "lastSeenTime": data.lastSeenTime || serverTimestamp(),
        "lastFedTime": data.lastFedTime || serverTimestamp(),
        "concernStatus": data.concernStatus || [],
        "concernDesc": data.concernDesc || "NONE"
    });
    await updateCat(cat.id, { "catID": cat.id });
};

/* ----- READ OPERATIONS ----- */
export const getAllCats = async () => {
    const allCats = await getDocs(catColl);
    const result = []
    allCats.forEach((cat) => {
        result.push(cat.data());
    });
    return result;
};

export const getCat = async (catID) => {
    return (await getDoc(doc(db, "Cat", catID))).data();
};

export const getUnfedCats = async () => {
    const twelveHoursAgo = Timestamp.fromDate(sub(Date.now(), { hours: 12 }));
    const q = query(catColl, where("lastFedTime", "<", twelveHoursAgo));
    const unfedCats = await getDocs(q);

    const result = []
    unfedCats.forEach((cat) => {
        result.push(cat.data());
    });
    return result;
};

export const getCatsOfConcern = async () => {
    const q = query(catColl, where("concernStatus", "!=", []))
    const catsOfConcern = await getDocs(q);

    const result = []
    catsOfConcern.forEach((cat) => {
        result.push(cat.data());
    });
    return result;
};

/* ----- UPDATE OPERATIONS ----- */
const updateCat = async (catID, updateFields) => {
    await updateDoc(doc(db, "Cat", catID), updateFields);
}

const userUpdateCat = async (userID, catID, updateType, updateFields) => {
    await addDoc(catUpdateColl, {
        "updateType": updateType,
        "userID": userID,
        "catID": catID,
        "updateFields": updateFields,
        "createTime": serverTimestamp()
    });
    await updateCat(catID, updateFields);
};

export const userUpdateCatLocation = async (userID, catID, location) => {
    await userUpdateCat(userID, catID, "Update Location", {
        "lastSeenLocation": location,
        "lastSeenTime": serverTimestamp()
    });
};

export const userUpdateCatConcern = async (userID, catID, concernStatus, location, concernDesc, photoURL) => {
    await userUpdateCat(userID, catID, "Update Concern", {
        "concernStatus": concernStatus,
        "lastSeenLocation": location,
        "concernDesc": concernDesc,
        "photoURL": photoURL,
        "lastSeenTime": serverTimestamp()
    });
};

export const userUpdateCatFed = async (userID, catID, time, location) => {
    await userUpdateCat(userID, catID, "Update Fed", {
        "lastFedTime": time,
        "lastSeenLocation": location,
        "lastSeenTime": serverTimestamp()
    });
};

export const userUpdateCatFoster = async (userID, catID, isFostered, reason) => {
    // TODO
};

export const userUpdateCatProfile = async (userID, catID, data) => {
    // TODO: List out the data
    await userUpdateCat(userID, catID, "Update Profile", data);
};


/* ----- DELETE OPERATIONS ----- */
const deleteCat = async (catID) => {
    await deleteDoc(doc(db, "Cat", catID));
}; 

export const userDeleteCat = async (userID, catID) => {
    await addDoc(catUpdateColl, {
        "updateType": "Delete",
        "userID": userID,
        "catID": catID,
        "updateFields": null,
        "createTime": serverTimestamp()
    });
    await deleteCat(catID);
};