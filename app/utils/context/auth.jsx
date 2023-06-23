import { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext({});
export const auth = getAuth();

export function useAuth() {
    return useContext(AuthContext);
}

// Authentication provider component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
            auth,
            (user) => setUser(user)
        );
        // Unsubscribe from auth state changes when component unmounts
        return unsubscribeFromAuthStatusChanged;
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
}
