import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: "AIzaSyDgph_4AdnIhptyqqxauAjWGNAfR5XGU1w",
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_API_KEY,
//     appId: process.env.FIREBASE_API_KEY,
// };

const firebaseConfig = {
    apiKey: "AIzaSyDgph_4AdnIhptyqqxauAjWGNAfR5XGU1w",
    authDomain: "catato-ea64f.firebaseapp.com",
    projectId: "catato-ea64f",
    storageBucket: "catato-ea64f.appspot.com",
    messagingSenderId: "312029122334",
    appId: "1:312029122334:web:910e9e8dc26a5ec02d030f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
