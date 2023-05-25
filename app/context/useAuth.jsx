import { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter } from "expo-router";

const AuthContext = createContext({});

export function useAuth() {
    return useContext(AuthContext);
}

// Authentication provider component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [errMsg, setErrMsg] = useState("");

    const auth = getAuth();

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribeFromAuthStatusChanged = onAuthStateChanged(auth, (user) => {
            user ? setUser(user) : setUser(null);
        });

        // Unsubscribe from auth state changes when component unmounts
        return () => {
            unsubscribeFromAuthStatusChanged();
        };
    }, [auth]);

    // Login function, for guest users (anonymous login)
    const loginAnonymously = async () => {
        try {
            await signInAnonymously(auth);
            const currentUser = auth.currentUser;
            setUser(currentUser);
        } catch (error) {
            console.error(error);
        }
    };

    // Login function, for users with email and password
    const loginWithEmail = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const currentUser = auth.currentUser;
            setUser(currentUser);
        } catch (error) {
            console.error(error);
            setErrMsg(error.message);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error(error);
        }
    };

    const value = {
        user,
        errMsg,
        setErrMsg,
        loginAnonymously,
        loginWithEmail,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
