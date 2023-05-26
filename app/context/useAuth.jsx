import { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter, useSegments } from "expo-router";

const AuthContext = createContext({});
const auth = getAuth();

export function useAuth() {
    return useContext(AuthContext);
}

// Reroutes users to main page and non-users to the authentication pages
function useProtectedRoute(user) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthScreens = segments[1] === "authentication";
        if (!user && !inAuthScreens) {
            router.replace("/screens/authentication/Welcome");
        } else if (user && inAuthScreens) {
            router.replace("/screens/main/Dashboard");
        };
    }, [user, segments, router])
}

// Authentication provider component
export function AuthProvider({ children }) {
    console.log("in AuthProvider");
    const [user, setUser] = useState(null);
    useProtectedRoute(user);

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribeFromAuthStatusChanged = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            // console.log(user);
            // user ? setUser(user) : setUser(null);
            console.log("auth state", user);
        });

        // Unsubscribe from auth state changes when component unmounts
        return unsubscribeFromAuthStatusChanged;
    }, []);

    // // Login function, for guest users (anonymous login)
    // const loginAnonymously = async () => {
    //     try {
    //         await signInAnonymously(auth);
    //         const currentUser = auth.currentUser;
    //         setUser(currentUser);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // // Login function, for users with email and password
    // const loginWithEmail = async (email, password) => {
    //     try {
    //         await signInWithEmailAndPassword(auth, email, password);
    //         const currentUser = auth.currentUser;
    //         setUser(currentUser);
    //     } catch (error) {
    //         console.error(error);
    //         setErrMsg(error.message);
    //     }
    // };

    // // Logout function
    // const logout = async () => {
    //     try {
    //         await signOut(auth);
    //         setUser(null);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // const value = {
    //     user,
    //     errMsg,
    //     setErrMsg,
    //     loginAnonymously,
    //     loginWithEmail,
    //     logout
    // };

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
